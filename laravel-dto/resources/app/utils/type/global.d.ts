declare global {
  interface Window {
    assetUrl: (path: string, withoutVersion?: string) => string;
  }
}

export {};
