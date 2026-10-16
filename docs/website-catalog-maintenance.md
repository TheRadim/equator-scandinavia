# Maintaining the prototype catalog

Edit website/src/data/bikes/catalog.ts and wheels/catalog.ts, not UI components. Keep permanent product/build IDs when names or images change. Keep exact factory bundles until independently offered upgrades and prices are confirmed. Prices are integer EUR cents; null means unknown. No automatic FX conversion. Changing a build price updates cart estimates from catalog data; saved browser prices are never trusted.

Inventory status uses: In stock, Available to order, Out of stock, Availability unconfirmed, Discontinued. Local regional inventory is currently unconfirmed; manufacturer observations are separately dated text. Update source URL, checked date, observed wording and inventory status together. Missing or failed source checks never promote a record to in-stock. Do not silently update verification dates. Manual review is the only inventory workflow; no scheduled synchronization exists.

Publication: prototype is visible in this demo; review is hidden; discontinued records are hidden regardless of publication flag. Production approval is a separate future decision. Held records remain in the data files for editorial review, not in the customer merchandise catalog. No accessory detail pages are generated until a current accessory is confirmed.

Images: replace files in website/public/images/ and paths in data/families.ts (bike presentation metadata) or wheels/catalog.ts. Retain image-sources.json provenance and permission information. Prefer appropriately sized WebP/AVIF, record alt text, and review mobile cropping. Never present a different model as the requested build; frameset pages label complete-bike photos illustrative.

Run npm test and npm run build inside website/. Review all changed source facts, desktop/mobile pages and the cart after product edits; commit and push with PROJECT_STATUS.md updated. Product refreshes must never touch operational Sheets manual fields.
