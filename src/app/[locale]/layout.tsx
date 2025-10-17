// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "./globals.css";
import ClientBody from "./ClientBody";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "KARYAGO",
    template: "%s | KARYAGO", // Jika halaman override title, akan ditambahkan template ini
  },
  description: "Manage your employee with ease",
  icons: {
    icon: "/KARYAGO-logo.png",
    shortcut: "/KARYAGO-logo.png",
    apple: "/KARYAGO-logo.png",
  },
};


async function getMessages(locale: string) {
  // Early check for common file extensions that aren't locales
  if (locale && /\.(ico|png|jpg|jpeg|svg|css|js|json|xml)$/i.test(locale)) {
    return {}; // Return empty messages for asset requests
  }

  try {
    // Default to 'en' if locale is null or undefined
    const safeLocale = locale || "en";
    return (await import(`../../messages/${safeLocale}.json`)).default;
  } catch (error) {
    console.error("Language not defined. Error:", error);
    // Fall back to English messages without logging
    try {
      return (await import(`../../messages/en.json`)).default;
    } catch {
      return {};
    }
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Get locale from URL parameters
  const { locale } = await params;

  const messages = await getMessages(locale);

  // Get nonce from headers (fixed implementation)
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";

  return (
    <html lang={locale} className={poppins.variable} suppressHydrationWarning>
      <head>
        {/* Store nonce in meta for client access */}
        <meta name="csp-nonce" content={nonce} />
      </head>
      <ClientBody nonce={nonce}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </ClientBody>
    </html>
  );
}
