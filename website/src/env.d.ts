interface ImportMetaEnv {
  readonly PUBLIC_INQUIRY_ENDPOINT?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_REPRESENTATIVE_EMAIL?: string;
  readonly PUBLIC_ALLOW_INDEXING?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
