import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { nanoid } from "nanoid";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const staticExtensions = [
    ".ico",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".css",
    ".js",
    ".json",
    ".xml",
  ];

  // Skip static files and common files like favicon, robots.txt, etc.
  if (
    staticExtensions.some((ext) => pathname.endsWith(ext)) ||
    ["/favicon.ico", "/robots.txt", "/sitemap.xml"].includes(pathname)
  ) {
    return NextResponse.next();
  }

  // First, handle internationalization for ALL requests
  // This ensures locale detection works properly
  const intlResponse = intlMiddleware(req);

  // If intlMiddleware returns a redirect (for locale detection), return it immediately
  if (intlResponse.status === 302 || intlResponse.status === 307) {
    return intlResponse;
  }

  // Now apply authentication logic on top of the internationalized request
  const url = req.nextUrl.clone();
  const authOK = req.cookies.get("authOK")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Extract locale from pathname after intl middleware processing
  const localeMatch = pathname.match(/^\/(en|de|id)/);
  const locale = localeMatch?.[1] || "en";

  // Determine if the path is for auth page based on locale (en|de|id)
  const isAuthPage = /^\/(en|de|id)\/auth/.test(pathname);
  // Check if the path is for schedule (sch/helperUuid) - should be unprotected
  const isSchedulePath = /^\/(en|de|id)\/sch\/[^/]+\/?$/.test(pathname);
  // Check if the path is for landing page - should be unprotected
  const isLandingPath = /^\/(en|de|id)\/landing\/?$/.test(pathname);
  // Check if path is just the locale without any additional path
  const isLocaleOnly = /^\/(en|de|id)\/?$/.test(pathname);
  const isActivationPath = /^\/(en|de|id)\/activation\/?$/.test(pathname);

  // Allow schedule paths, landing page, and activation path to bypass authentication
  if (isSchedulePath || isLandingPath || isActivationPath) {
    // Add nonce and CSP headers to the intl response
    const nonce = nanoid(16);
    const cspHeader = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'unsafe-inline' fonts.googleapis.com`,
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' blob: data: https://a93237d2b97806cf3621e5e5e0d8d6e7.r2.cloudflarestorage.com",
      "connect-src 'self' http://127.0.0.1:8080",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];
    intlResponse.headers.set("Content-Security-Policy", cspHeader.join("; "));
    intlResponse.headers.set("x-nonce", nonce);
    return intlResponse;
  }

  // Handle locale-only paths first (before other authentication checks)
  if (isLocaleOnly) {
    if (authOK === "true") {
      url.pathname = `/${locale}/select-company`;
      return NextResponse.redirect(url);
    } else {
      url.pathname = `/${locale}/auth`;
      return NextResponse.redirect(url);
    }
  }

  // Case 1: First time access without authentication
  if (!authOK && !refreshToken && !isAuthPage) {
    // Redirect to auth page for the corresponding locale
    url.pathname = `/${locale}/auth`;
    return NextResponse.redirect(url);
  }

  // Case 2: User has logged out or is not authenticated and not on auth page
  if (authOK === "false" && !isAuthPage) {
    url.pathname = `/${locale}/auth`; // Redirect to auth page based on locale
    url.searchParams.set("logout", "true");
    return NextResponse.redirect(url);
  }

  // Case 3: User is authenticated (authOK === "true") but trying to access auth page
  if (authOK === "true" && isAuthPage) {
    url.pathname = `/${locale}/choose-company`; // Redirect to choose-company if already logged in
    return NextResponse.redirect(url);
  }

  // Case 4: Attempt to refresh auth token if not authenticated
  if (!authOK && refreshToken && !isAuthPage) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refresh_token=${refreshToken}`,
          },
        }
      );

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        // Use the intl response and add auth cookies
        intlResponse.cookies.set("authOK", "true", { path: "/" });
        intlResponse.cookies.set("access_token", data.accessToken, { path: "/" });

        // Add CSP headers
        const nonce = nanoid(16);
        const cspHeader = [
          "default-src 'self'",
          `script-src 'self' 'nonce-${nonce}'`,
          `style-src 'self' 'unsafe-inline' fonts.googleapis.com`,
          "font-src 'self' fonts.gstatic.com",
          "img-src 'self' blob: data: https://a93237d2b97806cf3621e5e5e0d8d6e7.r2.cloudflarestorage.com",
          "connect-src 'self' http://127.0.0.1:8080",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ];
        intlResponse.headers.set("Content-Security-Policy", cspHeader.join("; "));
        intlResponse.headers.set("x-nonce", nonce);
        return intlResponse;
      } else {
        url.pathname = `/${locale}/auth`; // Redirect to auth page if refresh fails
        url.searchParams.set("logout", "true");
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = `/${locale}/auth`; // Redirect to auth page in case of error
      url.searchParams.set("logout", "true");
      return NextResponse.redirect(url);
    }
  }

  // Generate nonce for content security policy (CSP) and add to intl response
  const nonce = nanoid(16);
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'unsafe-inline' fonts.googleapis.com`,
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' blob: data: https://a93237d2b97806cf3621e5e5e0d8d6e7.r2.cloudflarestorage.com",
    "connect-src 'self' http://127.0.0.1:8080",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  intlResponse.headers.set("Content-Security-Policy", cspHeader.join("; "));
  intlResponse.headers.set("x-nonce", nonce);

  return intlResponse;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(en|de|id)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};