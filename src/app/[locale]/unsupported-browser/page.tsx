import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { parseUserAgent } from '@/utils/browser-support';

export default async function UnsupportedBrowserPage() {
  const t = await getTranslations('unsupportedBrowser');
  const userAgent = (await headers()).get('user-agent');
  const browserInfo = parseUserAgent(userAgent);

  const detectedBrowser = browserInfo
    ? `${browserInfo.name} ${browserInfo.version}`
    : t('unknownBrowser');

  return (
    <div className="min-h-screen bg-hlb-bg p-6 flex items-center justify-center">
      <div className="max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-hlb-primary">{t('title')}</h1>
        <p className="text-hlb-text/80">{t('description')}</p>
        <p className="text-sm text-hlb-text/70">{t('detected', { browser: detectedBrowser })}</p>
        <p className="text-sm font-medium text-hlb-text">{t('recommendation')}</p>
        <Link href="/" className="inline-block text-primary underline">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
