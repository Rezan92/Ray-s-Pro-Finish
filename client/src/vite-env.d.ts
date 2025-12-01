/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  // You can add other VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}