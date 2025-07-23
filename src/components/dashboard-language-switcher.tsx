"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DLanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = pathname.split("/")[1] || "en";

  const changeLanguage = (locale: string) => {
    const pathParts = pathname.split("/");
    pathParts[1] = locale;
    const newPath = pathParts.join("/");

    const query = searchParams.toString();
    const finalUrl = query ? `${newPath}?${query}` : newPath;

    router.push(finalUrl);
  };

  // Get display text based on screen size
  const getDisplayText = (locale: string) => ({
    mobile: locale.toUpperCase(),
    desktop:
      locale === "en" ? "English" : locale === "de" ? "German" : "Indonesian",
  });

  const currentDisplay = getDisplayText(currentLocale);
  return (
    <div className="relative text-gray-600">
      <Select defaultValue={currentLocale} onValueChange={changeLanguage}>
        <SelectTrigger className="w-14 h-8 p-0 border-0 sm:w-auto sm:h-auto sm:pl-8 sm:pr-3 sm:border text-sm font-medium flex items-center justify-center sm:justify-start bg-transparent hover:bg-gray-50 sm:bg-white">
          {/* Mobile: Show only globe icon */}
          <div className="flex items-center justify-center sm:absolute sm:left-2">
            <Globe size={16} className="text-gray-500 sm:text-gray-500" />
          </div>
          {/* Desktop: Show full language name */}
          <div className="hidden sm:block ml-2">
            <SelectValue placeholder="Select language">
              {currentDisplay.desktop}
            </SelectValue>
          </div>
        </SelectTrigger>{" "}
        <SelectContent align="end" className="min-w-[120px]">
          <SelectItem value="en" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">EN</span>
              <span className="hidden sm:inline text-sm text-gray-600">
                English
              </span>
            </div>
          </SelectItem>
          <SelectItem value="de" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">DE</span>
              <span className="hidden sm:inline text-sm text-gray-600">
                German
              </span>
            </div>
          </SelectItem>
          <SelectItem value="id" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">ID</span>
              <span className="hidden sm:inline text-sm text-gray-600">
                Indonesian
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DLanguageSwitcher;
