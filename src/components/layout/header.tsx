"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSwitcher } from "@/components/language-switcher";
import user from "@/lib/queries/user-queries";
import { useUserStore } from "@/stores/user-store";
import { Skeleton } from "../ui/skeleton";
import company from "@/lib/queries/company-queries";
import { useCompanyStore } from "@/stores/company-store";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api/constants";

export function Header() {
  const currentCompany = useCompanyStore((state) => state.currentCompany);
  const userInfo = useUserStore.getState().user;
  const isMobile = useIsMobile();
  const { isFetchingGetMe } = user.useGetMe();
  const router = useRouter();
  const {userLogout} = user.useLogOut();

  company.useGetCurrentCompanyByUserUuid(userInfo.userUuid ?? "");

  const handleLogout = ( () => {
    userLogout().
    then(() => {
      toast.success("Logged out successfully");
      router.push(`${API_URL.login}`);
    })
    .catch(() => {
      toast.error("Failed to log out");
    }); 
  });
  
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="flex items-center gap-4">
        {/* Show SidebarTrigger only on mobile */}
        {isMobile && (
          <>
            <SidebarTrigger className="-ml-1" />
            <div className="border-1 h-5 border-border/70" />
          </>
        )}
        <div className="flex items-center gap-2 hidden sm:flex">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            {currentCompany?.logo ? (
              <Image
              src={currentCompany.logo}
              alt="Company Logo"
              width={160}
              height={160}
              className="w-8 h-8 object-cover rounded-lg"
              />
            ) : (
              <span className="text-primary-foreground font-bold text-sm">
              {currentCompany?.name?.charAt(0).toUpperCase() ?? ""}
              </span>
            )}
          </div>
          <span className="font-semibold text-lg">{currentCompany?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-4 px-2 py-7">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  {userInfo?.name.fullName
                  ? userInfo.name.fullName.split(" ")[0][0].toUpperCase()
                  : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                {isFetchingGetMe ? (
                  <>
                    <Skeleton className="w-28 h-5" />
                    <Skeleton className="w-20 h-4" />
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium">
                      {userInfo?.name.fullName}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {userInfo?.role.name}
                    </div>
                  </>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* <DropdownMenu>My Account</DropdownMenu> */}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
