/// <reference path=".astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  // add other env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 