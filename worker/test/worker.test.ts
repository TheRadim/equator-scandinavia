import test from "node:test";
import assert from "node:assert/strict";
import { handle, type Env } from "../src/index.ts";
import { escapeHtml, parseInquiry, representativeEmail } from "../src/validate.ts";

function kv() {
  const m = new Map<string, string>();
  return { m, get: async (k: string) => m.get(k) ?? null, put: async (k: string, v: string) => void m.set(k, v) };
}
function env(over: Partial<Env> = {}): Env & { INQUIRY_KV: ReturnType<typeof kv> } {
  return {
    RESEND_API_KEY: "re_test",
    INQUIRY_RECIPIENT: "rep@example.com",
    INQUIRY_FROM: "Equator <noreply@example.com>",
    ALLOWED_ORIGIN: "https://site.example",
    TURNSTILE_SECRET_KEY: "ts_secret",
    INQUIRY_KV: kv(),
    ...over,
  } as never;
}
const base = {
  kind: "order",
  name: "Test Rider",
  email: "rider@example.com",
  phone: "+45 12 34 56 78",
  country: "Denmark",
  city: "2100",
  comments: "<b>hello</b>",
  consent: true,
  website: "",
  startedAt: 0,
  idempotencyKey: "3f2b6a10-1c2d-4e5f-8a9b-0c1d2e3f4a5b",
  turnstileToken: "tok",
  items: [{ productId: "sensei", buildId: "sensei-di2", size: "M", quantity: 1, price: 1 }],
};
function req(body: unknown, origin = "https://site.example") {
  return new Request("https://w.example/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, "CF-Connecting-IP": "1.2.3.4" },
    body: JSON.stringify(body),
  });
}
function deps(opts: { turnstile?: boolean; resendOk?: boolean } = {}) {
  const calls: { url: string; body: string }[] = [];
  const f = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: typeof init.body === "string" ? init.body : "" });
    if (url.includes("turnstile"))
      return new Response(JSON.stringify({ success: opts.turnstile ?? true }));
    return new Response("{}", { status: opts.resendOk === false ? 500 : 200 });
  }) as unknown as typeof fetch;
  return { calls, d: { fetch: f, now: () => new Date("2026-10-16T10:00:00Z"), random: () => new Uint8Array([1, 2, 3, 4, 5, 6]) } };
}

test("valid order is emailed with server-derived prices and a server reference", async () => {
  const e = env();
  const { calls, d } = deps();
  const res = await handle(req(base), e, d);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.reference, "EQ-20261016-BCDEFG");
  const mail = calls.find((c) => c.url.includes("resend"))!;
  const payload = JSON.parse(mail.body);
  assert.deepEqual(payload.to, ["rep@example.com"]);
  assert.equal(payload.reply_to, "rider@example.com");
  assert.match(payload.text, /€6,044/); // catalog price, not the injected price: 1
  assert.match(payload.text, /sensei \/ sensei-di2 \/ size M/);
  assert.doesNotMatch(payload.html, /<b>hello<\/b>/);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), "https://site.example");
});

test("duplicate submission returns original result without a second email", async () => {
  const e = env();
  const a = deps();
  await handle(req(base), e, a.d);
  const b = deps();
  const res = await handle(req(base), e, b.d);
  assert.equal(res.status, 200);
  assert.equal(b.calls.length, 0);
});

test("failed Turnstile, foreign origin, honeypot and fast submits are rejected", async () => {
  assert.equal((await handle(req(base), env(), deps({ turnstile: false }).d)).status, 400);
  assert.equal((await handle(req(base, "https://evil.example"), env(), deps().d)).status, 403);
  assert.equal((await handle(req({ ...base, website: "x" }), env(), deps().d)).status, 400);
  const fast = { ...base, startedAt: new Date("2026-10-16T10:00:00Z").getTime() - 500 };
  assert.equal((await handle(req(fast), env(), deps().d)).status, 400);
});

test("missing Turnstile secret fails closed unless explicitly in dev mode", async () => {
  assert.equal((await handle(req(base), env({ TURNSTILE_SECRET_KEY: undefined }), deps().d)).status, 400);
  assert.equal(
    (await handle(req(base), env({ TURNSTILE_SECRET_KEY: undefined, ALLOW_NO_TURNSTILE: "true" }), deps().d)).status,
    200,
  );
});

test("provider failure returns 502 and is not cached as accepted", async () => {
  const e = env();
  const res = await handle(req(base), e, deps({ resendOk: false }).d);
  assert.equal(res.status, 502);
  assert.equal([...e.INQUIRY_KV.m.keys()].some((k) => k.startsWith("idem:")), false);
});

test("unknown products, bad sizes and header injection are rejected", async () => {
  const bad = [
    { ...base, items: [{ productId: "sensei", buildId: "raiden-red", size: "M", quantity: 1 }] },
    { ...base, items: [{ productId: "sensei", buildId: "sensei-di2", size: "XS", quantity: 1 }] },
    { ...base, name: "Eve\r\nBcc: x@y.z" },
    { ...base, email: "not-an-email" },
    { ...base, consent: false },
    { ...base, items: [] },
  ];
  for (const b of bad) assert.equal((await handle(req(b), env(), deps().d)).status, 400, JSON.stringify(b).slice(0, 80));
});

test("rate limit blocks the sixth submission from one IP", async () => {
  const e = env();
  for (let i = 0; i < 5; i++) {
    const key = `3f2b6a10-1c2d-4e5f-8a9b-0c1d2e3f4a5${i}`;
    assert.equal((await handle(req({ ...base, idempotencyKey: key }), e, deps().d)).status, 200);
  }
  const res = await handle(req({ ...base, idempotencyKey: "3f2b6a10-1c2d-4e5f-8a9b-0c1d2e3f4a59" }), e, deps().d);
  assert.equal(res.status, 429);
});

test("contact message needs text and validates topic", () => {
  const c = { ...base, kind: "contact", items: undefined, topic: "Dealer partnership" };
  assert.equal(parseInquiry(c).items.length, 0);
  assert.throws(() => parseInquiry({ ...c, comments: "" }));
  assert.throws(() => parseInquiry({ ...c, topic: "Spam" }));
  const r = representativeEmail(parseInquiry(c), "EQ-1", "t");
  assert.match(r.subject, /Dealer partnership/);
  assert.equal(escapeHtml(`<a href="x">'`), "&lt;a href=&quot;x&quot;&gt;&#39;");
});
