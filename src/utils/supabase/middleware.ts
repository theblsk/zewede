import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const isProtectedRoute = (pathname: string, locale: string) => {
    const protectedPatterns = [
        `/${locale}/dashboard`,
        `/${locale}/api`,
        `/${locale}/onboarding`,
    ];
    
    return protectedPatterns.some(pattern => 
        pathname === pattern || pathname.startsWith(pattern + '/')
    );
}

const getLocaleFromPathname = (pathname: string): string => {
    const segments = pathname.split('/').filter(Boolean);
    const supportedLocales = ['en', 'ar'];
    
    if (segments.length > 0 && supportedLocales.includes(segments[0])) {
        return segments[0];
    }
    
    return 'en'; // default locale
}

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({name, value}) =>
                request.cookies.set(name, value)
              );
              cookiesToSet.forEach(({name, value, options}) =>
                response.cookies.set(name, value, options)
              );
            }
          }
        }
      );
     
      const {
        data: {user}
      } = await supabase.auth.getUser();

    // Extract locale from pathname using our custom function
    const pathname = request.nextUrl.pathname;
    const locale = getLocaleFromPathname(pathname);

    if (
      !user &&
      isProtectedRoute(pathname, locale)
    ) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      return NextResponse.redirect(url)
    }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return response;
}
