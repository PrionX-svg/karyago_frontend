"use client";

import type React from "react";
import { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Calendar,
  FileText,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  email: string;
}

interface GlassDashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/dashboard",
    roles: ["ceo", "employee"],
  },
  {
    title: "Employees",
    icon: Users,
    url: "/employees",
    roles: ["ceo"],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/analytics",
    roles: ["ceo"],
  },
  {
    title: "Calendar",
    icon: Calendar,
    url: "/calendar",
    roles: ["ceo", "employee"],
  },
  {
    title: "Documents",
    icon: FileText,
    url: "/documents",
    roles: ["ceo", "employee"],
  },
  {
    title: "Company",
    icon: Building2,
    url: "/company",
    roles: ["ceo", "employee"],
  },
];

export function GlassDashboardLayout({
  children,
  user,
}: GlassDashboardLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();
  const filteredNavigation = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const handleNavigation = (url: string) => {
    // Assuming locale and company are available in the URL or context
    const locale = "en"; // This should come from your app's locale context
    const company = "acme"; // This should come from your app's company context
    router.push(`/${locale}/${company}${url}`);
  };

  const companyName = useParams().company || "";

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "relative transition-all duration-500 ease-in-out",
            sidebarExpanded ? "w-72" : "w-20"
          )}
        >
          <div
            className="fixed top-0 left-0 h-full z-30 transition-all duration-500 ease-in-out backdrop-blur-xl bg-sidebar/80 border-r border-sidebar-border shadow-2xl overflow-hidden"
            style={{
              width: sidebarExpanded ? "288px" : "80px",
            }}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-sidebar-border/50">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex items-center gap-3 transition-all duration-300",
                    !sidebarExpanded && "justify-center"
                  )}
                >
                  {sidebarExpanded && (
                    <>
                      <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-primary-foreground font-bold text-sm">
                          {companyName[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-bold text-xl text-sidebar-foreground font-poppins">
                        {companyName}
                      </span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className="w-8 h-8 rounded-xl hover:bg-sidebar-accent transition-all duration-200"
                >
                  {sidebarExpanded ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 space-y-2">
              {filteredNavigation.map((item) => (
                <div key={item.title}>
                  {sidebarExpanded ? (
                    <button
                      onClick={() => handleNavigation(item.url)}
                      className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group hover:bg-sidebar-accent text-sidebar-foreground"
                    >
                      <item.icon className="w-5 h-5 text-sidebar-foreground/70 group-hover:text-sidebar-foreground transition-colors duration-200" />
                      <span className="font-medium group-hover:text-sidebar-foreground transition-colors duration-200">
                        {item.title}
                      </span>
                    </button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleNavigation(item.url)}
                          className="w-full flex items-center justify-center px-2 py-3 rounded-2xl transition-all duration-200 group hover:bg-sidebar-accent text-sidebar-foreground"
                        >
                          <item.icon className="w-5 h-5 text-sidebar-foreground/70 group-hover:text-sidebar-foreground transition-colors duration-200" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="ml-2">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>

            {/* Premium Card */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden",
                sidebarExpanded
                  ? "max-h-52 opacity-100 translate-y-0 mt-4 p-4 border-t border-sidebar-border/50"
                  : "max-h-0 opacity-0 -translate-y-4 p-0 mt-0 border-t-0"
              )}
              style={{ pointerEvents: sidebarExpanded ? "auto" : "none" }}
            >
              <div
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  sidebarExpanded
                    ? "p-4 rounded-3xl bg-primary/90 backdrop-blur-xl text-primary-foreground shadow-2xl"
                    : "p-0"
                )}
              >
                <h3 className="font-bold text-sm mb-1 font-poppins">
                  Ama Premium
                </h3>
                <p className="text-xs opacity-90 mb-3">
                  Automation, AI-assistant and 30+ other pro features
                </p>
                <Button
                  size="sm"
                  className="w-full bg-primary-foreground/20 hover:bg-primary-foreground/30 border-0 backdrop-blur-sm transition-all duration-200 text-primary-foreground"
                >
                  $16.99/mo →
                </Button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              {sidebarExpanded ? (
                <>
                  <a
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-sidebar-accent text-sidebar-foreground"
                  >
                    <Settings className="w-5 h-5 text-sidebar-foreground/70" />
                    <span className="font-medium">Settings</span>
                  </a>
                  <a
                    href="/logout"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-destructive/10 text-destructive"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log out</span>
                  </a>
                </>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href="/settings"
                        className="flex items-center justify-center px-2 py-3 rounded-2xl transition-all duration-200 hover:bg-sidebar-accent text-sidebar-foreground"
                      >
                        <Settings className="w-5 h-5 text-sidebar-foreground/70" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href="/logout"
                        className="flex items-center justify-center px-2 py-3 rounded-2xl transition-all duration-200 hover:bg-destructive/10 text-destructive"
                      >
                        <LogOut className="w-5 h-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>Log out</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="sticky top-0 z-20 h-16 backdrop-blur-2xl bg-background/60 border-b border-border shadow-lg">
            <div className="flex h-full items-center justify-between px-6">
              <div className="flex items-center gap-4">
                {!sidebarExpanded && (
                  <div className="flex items-center gap-3 mr-4">
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">
                        {companyName[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="font-bold text-lg text-foreground font-poppins">
                      {companyName}
                    </span>
                  </div>
                )}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 bg-muted/50 border-border/30 backdrop-blur-sm rounded-2xl focus:bg-muted/70 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-2xl hover:bg-accent transition-all duration-200"
                >
                  <Bell className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-accent transition-all duration-200"
                    >
                      <div className="text-right">
                        <div className="text-sm font-medium font-poppins">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.title}
                        </div>
                      </div>
                      <Avatar className="w-8 h-8 ring-2 ring-border">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 backdrop-blur-xl bg-popover/80 border-border shadow-2xl rounded-2xl"
                  >
                    <DropdownMenuLabel className="font-poppins">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="rounded-xl">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="rounded-xl text-destructive">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full px-12">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
