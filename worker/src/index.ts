/**
 * Equator Scandinavia inquiry endpoint (Cloudflare Worker).
 *
 * POST /inquiry  — validates an order inquiry or contact message, verifies
 * Cloudflare Turnstile, re-derives prices from the catalog, and emails the
 * representative through Resend. Secrets live in Worker secrets, never in
 * the static site. See worker/README.md for setup.
 */
import {
  InputError,
  MAX_BODY_BYTES,
  customerEmail,
  makeReference,
  parseInquiry,
  representativeEmail,
} from "./validate.ts";

export interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

export interface Env {
  RESEND_API_KEY: string;
  INQUIRY_RECIPIENT: string;
  INQUIRY_FROM: string;
  ALLOWED_ORIGIN: string;
  TURNSTILE_SECRET_KEY?: string;
  /** "true" only for local development without Turnstile. Never in production. */
  ALLOW_NO_TURNSTILE?: string;
  /** "true" to send the customer a copy of their inquiry. */
  SEND_CUSTOMER_CONFIRMATION?: string;
  INQUIRY_KV: KV;
}

const IDEMPOTENCY_TTL = 60 * 60 * 24;
const RATE_WINDOW = 60 * 10;
const RATE_LIMIT = 5;

function cors(env: Env, origin: string | null): Record<string, string> {
  const allowed = env.ALLOWED_ORIGIN.split(",").map((s) => s.trim());
  return origin && allowed.includes(origin)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : { Vary: "Origin" };
}

function json(status: number, body: unknown, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

async function sha256(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(env: Env, token: string, ip: string | null, fetcher: typeof fetch) {
  if (!env.TURNSTILE_SECRET_KEY) return env.ALLOW_NO_TURNSTILE === "true";
  if (!token) return false;
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  const res = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

async function sendEmail(
  env: Env,
  fetcher: typeof fetch,
  msg: { to: string; subject: string; text: string; html: string; replyTo?: string },
  idempotencyKey: string,
) {
  const res = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: env.INQUIRY_FROM,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10000),
  });
  return res.ok;
}

export async function handle(
  request: Request,
  env: Env,
  deps: { fetch: typeof fetch; now: () => Date; random: () => Uint8Array } = {
    fetch: (...a) => fetch(...a),
    now: () => new Date(),
    random: () => crypto.getRandomValues(new Uint8Array(6)),
  },
): Promise<Response> {
  const origin = request.headers.get("Origin");
  const headers = cors(env, origin);
  const url = new URL(request.url);
  if (url.pathname !== "/inquiry") return json(404, { ok: false, error: "Not found." }, headers);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed." }, headers);
  if (!headers["Access-Control-Allow-Origin"])
    return json(403, { ok: false, error: "This origin is not allowed." }, headers);
  for (const k of ["RESEND_API_KEY", "INQUIRY_RECIPIENT", "INQUIRY_FROM"] as const)
    if (!env[k]) return json(503, { ok: false, error: "Inquiries are temporarily unavailable." }, headers);
  if (!(request.headers.get("Content-Type") || "").includes("application/json"))
    return json(415, { ok: false, error: "Unsupported request." }, headers);

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES)
    return json(413, { ok: false, error: "Your inquiry is too large." }, headers);

  let inquiry;
  try {
    inquiry = parseInquiry(JSON.parse(raw), deps.now().getTime());
  } catch (e) {
    const err = e instanceof InputError ? e : new InputError("Invalid request.");
    return json(400, { ok: false, error: err.message, field: err.field }, headers);
  }

  // Idempotency: a retried submission returns the original result without a second email.
  const idemKey = `idem:${inquiry.idempotencyKey}`;
  const previous = await env.INQUIRY_KV.get(idemKey);
  if (previous) return json(200, JSON.parse(previous), headers);

  const ip = request.headers.get("CF-Connecting-IP");
  const rateKey = `rate:${await sha256(ip || "unknown")}`;
  const count = Number((await env.INQUIRY_KV.get(rateKey)) || "0");
  if (count >= RATE_LIMIT)
    return json(429, { ok: false, error: "Too many submissions. Please try again later." }, headers);
  await env.INQUIRY_KV.put(rateKey, String(count + 1), { expirationTtl: RATE_WINDOW });

  let human = false;
  try {
    human = await verifyTurnstile(env, inquiry.turnstileToken, ip, deps.fetch);
  } catch {
    human = false;
  }
  if (!human)
    return json(400, { ok: false, error: "We couldn't verify the submission. Please complete the check and try again.", field: "verification" }, headers);

  const now = deps.now();
  const receivedAt = now.toISOString();
  const reference = makeReference(now, deps.random());
  const rep = representativeEmail(inquiry, reference, receivedAt);
  let accepted = false;
  try {
    accepted = await sendEmail(
      env,
      deps.fetch,
      { to: env.INQUIRY_RECIPIENT, replyTo: inquiry.email, ...rep },
      `rep-${inquiry.idempotencyKey}`,
    );
  } catch {
    accepted = false;
  }
  if (!accepted)
    return json(502, { ok: false, error: "We couldn't send your inquiry just now. Your bag has been kept — please try again shortly." }, headers);

  const result = { ok: true, reference, receivedAt };
  await env.INQUIRY_KV.put(idemKey, JSON.stringify(result), { expirationTtl: IDEMPOTENCY_TTL });

  // Optional customer copy. Its failure never turns an accepted inquiry into a retry.
  if (env.SEND_CUSTOMER_CONFIRMATION === "true") {
    try {
      await sendEmail(env, deps.fetch, { to: inquiry.email, ...customerEmail(inquiry, reference) }, `cust-${inquiry.idempotencyKey}`);
    } catch {
      /* ignored by design */
    }
  }
  return json(200, result, headers);
}

export default {
  fetch(request: Request, env: Env) {
    return handle(request, env);
  },
};
