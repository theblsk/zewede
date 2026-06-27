export type BrowserInfo = {
  name: string;
  version: number;
  isSupported: boolean;
  reason?: 'ie' | 'firefox_outdated' | 'chromium_outdated' | 'safari_outdated';
};

const MIN_VERSIONS = {
  chrome: 111,
  edge: 111,
  firefox: 111,
  safari: 16.4,
} as const;

export function parseUserAgent(userAgent: string | null): BrowserInfo | null {
  if (!userAgent) {
    return null;
  }

  if (/MSIE|Trident/.test(userAgent)) {
    return {
      name: 'Internet Explorer',
      version: 0,
      isSupported: false,
      reason: 'ie',
    };
  }

  const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
  if (firefoxMatch) {
    const version = Number.parseInt(firefoxMatch[1], 10);
    return {
      name: 'Firefox',
      version,
      isSupported: version >= MIN_VERSIONS.firefox,
      reason: version < MIN_VERSIONS.firefox ? 'firefox_outdated' : undefined,
    };
  }

  const edgeMatch = userAgent.match(/Edg\/(\d+)/);
  if (edgeMatch) {
    const version = Number.parseInt(edgeMatch[1], 10);
    return {
      name: 'Microsoft Edge',
      version,
      isSupported: version >= MIN_VERSIONS.edge,
      reason: version < MIN_VERSIONS.edge ? 'chromium_outdated' : undefined,
    };
  }

  const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
  if (chromeMatch && !/Edg\//.test(userAgent)) {
    const version = Number.parseInt(chromeMatch[1], 10);
    return {
      name: 'Google Chrome',
      version,
      isSupported: version >= MIN_VERSIONS.chrome,
      reason: version < MIN_VERSIONS.chrome ? 'chromium_outdated' : undefined,
    };
  }

  const safariMatch = userAgent.match(/Version\/(\d+\.?\d*).*Safari/);
  if (safariMatch && !/Chrome/.test(userAgent)) {
    const version = Number.parseFloat(safariMatch[1]);
    return {
      name: 'Safari',
      version,
      isSupported: version >= MIN_VERSIONS.safari,
      reason: version < MIN_VERSIONS.safari ? 'safari_outdated' : undefined,
    };
  }

  return null;
}

/**
 * Returns true when the browser is supported for dashboard editing.
 * Unknown or unparseable user agents are allowed through (modern path unchanged).
 */
export function isDashboardBrowserSupported(userAgent: string | null): boolean {
  const info = parseUserAgent(userAgent);
  if (!info) {
    return true;
  }

  return info.isSupported;
}

export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const supportedLocales = ['en', 'ar'];

  if (segments.length > 0 && supportedLocales.includes(segments[0])) {
    return segments[0];
  }

  return 'en';
}

export function isDashboardRoute(pathname: string, locale: string): boolean {
  const prefix = `/${locale}/dashboard`;
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isUnsupportedBrowserPage(pathname: string, locale: string): boolean {
  return pathname === `/${locale}/unsupported-browser`;
}
