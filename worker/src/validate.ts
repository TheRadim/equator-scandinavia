/**
 * Pure validation and formatting for inquiry submissions. No I/O here so it
 * can be unit-tested with Node's test runner.
 */
import {
  money,
  resolve,
  totals,
  validateLine,
  type Line,
} from "../../website/src/lib/catalog.ts";
import { COUNTRIES, TOPICS } from "../../website/src/lib/inquiry.ts";

export const MAX_BODY_BYTES = 32 * 1024;
export { COUNTRIES, TOPICS };

export type Inquiry = {
  kind: "order" | "contact";
  name: string;
  email: string;
  phone: string;
  country: (typeof COUNTRIES)[number];
  city: string;
  topic: string;
  comments: string;
  items: Line[];
  idempotencyKey: string;
  turnstileToken: string;
};

export class InputError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
function text(
  v: unknown,
  field: string,
  { max, required = false, multiline = false }: { max: number; required?: boolean; multiline?: boolean },
): string {
  if (v === undefined || v === null || v === "") {
    if (required) throw new InputError(`Please fill in ${field}.`, field);
    return "";
  }
  if (typeof v !== "string") throw new InputError(`Invalid ${field}.`, field);
  const s = v.trim();
  if (required && !s) throw new InputError(`Please fill in ${field}.`, field);
  if (s.length > max) throw new InputError(`${field} is too long.`, field);
  if (CONTROL.test(s) || (!multiline && /[\r\n]/.test(s)))
    throw new InputError(`${field} contains unsupported characters.`, field);
  return s;
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Validate a decoded JSON body. Throws InputError with a customer-safe message. */
export function parseInquiry(body: unknown, now = Date.now()): Inquiry {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new InputError("Invalid request.");
  const b = body as Record<string, unknown>;
  // Honeypot: real visitors never see or fill this field.
  if (typeof b.website === "string" && b.website.trim() !== "")
    throw new InputError("Submission rejected.", "spam");
  // Minimum fill time: forms submitted within 3 s of rendering are bots.
  if (typeof b.startedAt === "number" && now - b.startedAt < 3000)
    throw new InputError("Please take a moment to review your details and try again.", "spam");
  if (b.consent !== true)
    throw new InputError("Please accept the privacy policy to continue.", "consent");
  const kind = b.kind === "contact" ? "contact" : b.kind === "order" ? "order" : null;
  if (!kind) throw new InputError("Invalid request type.");
  const email = text(b.email, "email", { max: 200, required: true });
  if (!EMAIL.test(email)) throw new InputError("Please enter a valid email address.", "email");
  const country = text(b.country, "country", { max: 20, required: true });
  if (!(COUNTRIES as readonly string[]).includes(country))
    throw new InputError("Please choose a country.", "country");
  const topic = text(b.topic, "topic", { max: 40 });
  if (topic && !(TOPICS as readonly string[]).includes(topic))
    throw new InputError("Please choose a topic.", "topic");
  const phone = text(b.phone, "phone", { max: 40 });
  if (phone && !/^[+()0-9 .-]{5,40}$/.test(phone))
    throw new InputError("Please enter a valid phone number.", "phone");
  const idempotencyKey = text(b.idempotencyKey, "idempotencyKey", { max: 36, required: true });
  if (!UUID.test(idempotencyKey)) throw new InputError("Invalid request.");

  let items: Line[] = [];
  if (kind === "order") {
    if (!Array.isArray(b.items) || b.items.length === 0)
      throw new InputError("Your bag is empty.", "items");
    if (b.items.length > 30) throw new InputError("Too many items.", "items");
    try {
      // Only identifiers and quantities are trusted from the browser; prices are re-derived.
      items = b.items.map((raw) => {
        const l = validateLine(raw);
        return { productId: l.productId, buildId: l.buildId, size: l.size, quantity: l.quantity };
      });
    } catch (e) {
      throw new InputError(
        e instanceof Error ? e.message : "An item in your bag is no longer available.",
        "items",
      );
    }
  }
  const comments = text(b.comments, "comments", { max: 2000, multiline: true });
  if (kind === "contact" && !comments)
    throw new InputError("Please write a short message.", "comments");

  return {
    kind,
    name: text(b.name, "name", { max: 100, required: true }),
    email,
    phone,
    country: country as Inquiry["country"],
    city: text(b.city, "city or postal code", { max: 100, required: true }),
    topic,
    comments,
    items,
    idempotencyKey,
    turnstileToken: text(b.turnstileToken, "verification", { max: 2048 }),
  };
}

export function makeReference(date: Date, random: Uint8Array): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const tail = [...random.slice(0, 6)].map((n) => alphabet[n % alphabet.length]).join("");
  return `EQ-${d}-${tail}`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export type Summary = {
  lines: { quantity: number; name: string; description: string; price: string; productId: string; buildId: string; size: string; availability: string }[];
  total: string;
};

export function summarize(items: Line[]): Summary {
  const lines = items.map((l) => {
    const r = resolve(l);
    return {
      quantity: l.quantity,
      name: r.name,
      description: r.description,
      price: money(r.price),
      productId: l.productId,
      buildId: l.buildId,
      size: l.size,
      availability: r.availability,
    };
  });
  const t = totals(items);
  const total = t.unknown
    ? `${money(t.subtotal)} + items priced on request`
    : money(t.subtotal);
  return { lines, total };
}

/** Plain-text and HTML bodies for the representative. All customer input is escaped in HTML. */
export function representativeEmail(inq: Inquiry, reference: string, receivedAt: string) {
  const s = summarize(inq.items);
  const subject =
    inq.kind === "order"
      ? `Build inquiry ${reference} — ${inq.name} (${inq.country})`
      : `Contact ${reference} — ${inq.topic || "General question"} — ${inq.name}`;
  const rows: [string, string][] = [
    ["Reference", reference],
    ["Received (UTC)", receivedAt],
    ["Type", inq.kind === "order" ? "Order inquiry" : "Contact message"],
    ["Name", inq.name],
    ["Email", inq.email],
    ["Phone", inq.phone || "—"],
    ["Country", inq.country],
    ["City / postal code", inq.city],
  ];
  if (inq.topic) rows.push(["Topic", inq.topic]);
  const textLines = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    ...(inq.items.length
      ? [
          "ITEMS (manufacturer reference prices, EUR)",
          ...s.lines.map(
            (l) =>
              `- ${l.quantity} × ${l.name} — ${l.description} — ${l.price}\n  ids: ${l.productId} / ${l.buildId}${l.size ? " / size " + l.size : ""}\n  availability note: ${l.availability}`,
          ),
          `Estimated total: ${s.total}`,
          "",
        ]
      : []),
    "COMMENTS",
    inq.comments || "—",
    "",
    "Not a confirmed order. Confirm price, availability and delivery with the customer before any payment.",
  ];
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#171717;font-size:14px">
<h2 style="font-weight:500">${escapeHtml(subject)}</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#666">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
${
  inq.items.length
    ? `<h3 style="font-weight:500">Items</h3><table cellpadding="6" style="border-collapse:collapse;border-top:1px solid #ddd">${s.lines
        .map(
          (l) =>
            `<tr style="border-bottom:1px solid #eee"><td>${l.quantity} ×</td><td><strong>${escapeHtml(l.name)}</strong><br>${escapeHtml(l.description)}<br><small style="color:#666">${escapeHtml(`${l.productId} / ${l.buildId}${l.size ? " / " + l.size : ""}`)} · ${escapeHtml(l.availability)}</small></td><td>${escapeHtml(l.price)}</td></tr>`,
        )
        .join("")}</table><p><strong>Estimated total:</strong> ${escapeHtml(s.total)}</p>`
    : ""
}
<h3 style="font-weight:500">Comments</h3><p style="white-space:pre-wrap">${escapeHtml(inq.comments || "—")}</p>
<p style="color:#666;font-size:12px">Not a confirmed order. Confirm price, availability and delivery with the customer before any payment.</p>
</body></html>`;
  return { subject, text: textLines.join("\n"), html };
}

export function customerEmail(inq: Inquiry, reference: string) {
  const s = summarize(inq.items);
  const subject = `We received your inquiry (${reference})`;
  const body = [
    `Hi ${inq.name},`,
    "",
    inq.kind === "order"
      ? "Thanks for your inquiry. We'll review your configuration, confirm availability and pricing, and get back to you."
      : "Thanks for getting in touch. We'll get back to you.",
    "",
    `Reference: ${reference}`,
    ...(inq.items.length
      ? ["", ...s.lines.map((l) => `- ${l.quantity} × ${l.name} — ${l.description} — ${l.price}`), `Estimated total: ${s.total}`]
      : []),
    "",
    "This is not an order confirmation and nothing has been charged. Prices shown are estimates; your order will be reviewed and confirmed before payment.",
    "",
    "Equator Scandinavia",
  ].join("\n");
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#171717;font-size:14px;line-height:1.6"><p style="white-space:pre-wrap">${escapeHtml(body)}</p></body></html>`;
  return { subject, text: body, html };
}
