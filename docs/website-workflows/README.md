# Workflows

Installed in `.github/workflows/`; these copies are kept as reference.

- `website-check.yml` — on push/PR touching `website/` or `worker/`: site tests, astro check + build, worker tests.
- `website-deploy.yml` (copy: `website-pages.yml`) — on push to `codex/website-prototype` touching `website/`, or manual run: tests, builds and force-pushes `website/dist` to the `gh-pages` branch. GitHub Pages serves that branch (Settings → Pages → Deploy from a branch → `gh-pages`, `/ (root)`).

Build variables (Settings → Secrets and variables → Actions → Variables, all optional): `PUBLIC_INQUIRY_ENDPOINT` (empty = demo inquiries), `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_REPRESENTATIVE_EMAIL`, `PUBLIC_ALLOW_INDEXING` (`true` only at public launch).
