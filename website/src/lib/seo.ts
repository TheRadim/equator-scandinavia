import { url } from "./urls.ts";

/**
 * Product structured data. Offers (price/availability) are deliberately
 * omitted: the site shows manufacturer reference prices and unconfirmed
 * regional availability, not a binding Scandinavian offer. Add an Offer once
 * approved prices and confirmed stock exist.
 */
export function productJsonLd(p: {
  name: string;
  description: string;
  image?: string | null;
  path: string;
  status?: string;
}) {
  const site = String(import.meta.env.SITE ?? "").replace(/\/$/, "");
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: "Equator" },
    url: site + url(p.path),
  };
  if (p.image) data.image = site + url(p.image);
  return data;
}
