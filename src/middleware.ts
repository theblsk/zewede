import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import {
  getLocaleFromPathname,
  isDashboardBrowserSupported,
  isDashboardRoute,
  isUnsupportedBrowserPage,
} from './utils/browser-support';
import { updateSession } from './utils/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPathname(pathname);

  if (
    isDashboardRoute(pathname, locale) &&
    !isUnsupportedBrowserPage(pathname, locale) &&
    !isDashboardBrowserSupported(request.headers.get('user-agent'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/unsupported-browser`;
    return NextResponse.redirect(url);
  }

  const response = handleI18nRouting(request);

  return await updateSession(request, response);
}
 
export const config = {
  matcher: ['/', '/(en|ar)/:path*']
};