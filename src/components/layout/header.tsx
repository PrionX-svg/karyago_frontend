"use client";

import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import { useGeneralStore } from "@/stores/genaral-store";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();
  const isSidebarCollapsed = useGeneralStore((s) => s.isSidebarCollapsed);
  const toggleSidebarCollapse = useGeneralStore((s) => s.toggleSidebarCollapse);

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
            <span className="text-primary-foreground font-bold text-sm">
              ZY
            </span>
          </div>
          <span className="font-semibold text-lg">Zozyo®</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar collapse"
            onClick={toggleSidebarCollapse}
            className="ml-2"
          >
            <ChevronDown
              className={
                isSidebarCollapsed
                  ? "w-5 h-5 rotate-90 transition-transform"
                  : "w-5 h-5 -rotate-90 transition-transform"
              }
            />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
          >
            1
          </Badge>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>EG</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium">Erik Garnacho</div>
                <div className="text-xs text-muted-foreground">Employee</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
