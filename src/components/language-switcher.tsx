"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/i18n/config";
import { ChevronDown, Globe } from "lucide-react";

const localeLabels = {
  en: "English",
  de: "Deutsch",
  id: "Bahasa",
} as const;

export function LanguageSwitcher() {
  const nextIntlLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<string>(nextIntlLocale);

  // Extract locale from pathname to ensure sync with URL
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const pathLocale = segments[0];

    if (locales.includes(pathLocale as (typeof locales)[number])) {
      setCurrentLocale(pathLocale);
    } else {
      setCurrentLocale(nextIntlLocale);
    }
  }, [pathname, nextIntlLocale]);

  const handleLanguageChange = (newLocale: string) => {
    // Don't do anything if we're already on the selected locale
    if (currentLocale === newLocale) return;

    // Get the current pathname without the locale prefix
    const segments = pathname.split("/").filter(Boolean);

    // Check if the first segment is a locale
    const isLocaleInPath = locales.includes(
      segments[0] as (typeof locales)[number]
    );

    // Construct the new path
    let newPath;
    if (isLocaleInPath) {
      // Replace the locale in the path
      segments[0] = newLocale;
      newPath = "/" + segments.join("/");
    } else {
      // Add the locale to the path
      newPath = `/${newLocale}${pathname}`;
    }

    // Update the current locale state immediately for UI feedback
    setCurrentLocale(newLocale);

    // Use router.push for seamless navigation without page reload
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-3">
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {localeLabels[currentLocale as keyof typeof localeLabels]}
          </span>
          <span className="sm:hidden uppercase">{currentLocale}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`cursor-pointer ${
              currentLocale === lang ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <span className="flex items-center justify-between w-full">
              <span>{localeLabels[lang as keyof typeof localeLabels]}</span>
              <span className="text-xs text-muted-foreground uppercase">
                {lang}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
