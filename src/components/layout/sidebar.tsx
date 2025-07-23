"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  Clock,
  CheckSquare,
  Users,
  Calendar,
  Folder,
  BarChart3,
  MessageSquare,
  Github,
  HelpCircle,
  Play,
  ChevronDown,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = {
  feature: [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Time-off", icon: Clock, path: "/time-off" },
    { name: "Tasks", icon: CheckSquare, path: "/tasks", expandable: true },
  ],
  company: [
    { name: "Employees", icon: Users, path: "/employees", expandable: true },
    { name: "Calendar", icon: Calendar, path: "/calendar", expandable: true },
    { name: "Files", icon: Folder, path: "/files", expandable: true },
    { name: "Report", icon: BarChart3, path: "/reports", expandable: true },
  ],
  apps: [
    { name: "Slack", icon: MessageSquare, path: "/apps/slack" },
    { name: "Github", icon: Github, path: "/apps/github" },
  ],
  bottom: [
    { name: "Support Center", icon: HelpCircle, path: "/support" },
    {
      name: "Getting Started",
      icon: Play,
      path: "/getting-started",
      active: true,
    },
  ],
};

// Desktop Sidebar Component (Regular Div with Sticky)
function DesktopSidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out sticky top-17.5 h-[calc(100vh-4.4rem)] overflow-hidden",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <div
          className={cn("transition-all duration-300", isCollapsed && "hidden")}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
            <input
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-sidebar-accent/50 border border-sidebar-border rounded-md text-sidebar-foreground placeholder:text-sidebar-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
          </div>
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="mt-3 w-full flex items-center justify-center p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isCollapsed ? "rotate-90" : "-rotate-90"
            )}
          />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Feature Section */}
        <div className="p-4">
          <div
            className={cn(
              "text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3",
              isCollapsed && "hidden"
            )}
          >
            FEATURE
          </div>
          <div className="space-y-1">
            {navigationItems.feature.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  item.name === "Profile" &&
                    "bg-sidebar-primary text-sidebar-primary-foreground",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span
                  className={cn(
                    "transition-all duration-300",
                    isCollapsed && "hidden"
                  )}
                >
                  {item.name}
                </span>
                {item.expandable && !isCollapsed && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 ml-auto transition-transform",
                      expandedItems.includes(item.name) && "rotate-180"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpanded(item.name);
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Company Section */}
        <div className="p-4">
          <div
            className={cn(
              "text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3",
              isCollapsed && "hidden"
            )}
          >
            COMPANY
          </div>
          <div className="space-y-1">
            {navigationItems.company.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span
                  className={cn(
                    "transition-all duration-300",
                    isCollapsed && "hidden"
                  )}
                >
                  {item.name}
                </span>
                {item.expandable && !isCollapsed && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 ml-auto transition-transform",
                      expandedItems.includes(item.name) && "rotate-180"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpanded(item.name);
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Apps Section */}
        <div className="p-4">
          <div
            className={cn(
              "text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3",
              isCollapsed && "hidden"
            )}
          >
            APPS
          </div>
          <div className="space-y-1">
            {navigationItems.apps.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span
                  className={cn(
                    "transition-all duration-300",
                    isCollapsed && "hidden"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0 bg-sidebar">
        <div className="space-y-1">
          {navigationItems.bottom.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                item.active &&
                  "bg-sidebar-primary text-sidebar-primary-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span
                className={cn(
                  "transition-all duration-300",
                  isCollapsed && "hidden"
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mobile Sidebar Component (Using Sidebar Component)
function MobileSidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
          <SidebarInput
            placeholder="Search"
            className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-section-title">
            FEATURE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.feature.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "sidebar-nav-item sidebar-transition",
                      item.name === "Profile" && "active"
                    )}
                  >
                    <Link href={item.path} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                      {item.expandable && (
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 ml-auto transition-transform",
                            expandedItems.includes(item.name) && "rotate-180"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleExpanded(item.name);
                          }}
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-section-title">
            COMPANY
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.company.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className="sidebar-nav-item sidebar-transition"
                  >
                    <Link href={item.path} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                      {item.expandable && (
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 ml-auto transition-transform",
                            expandedItems.includes(item.name) && "rotate-180"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleExpanded(item.name);
                          }}
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-section-title">
            APPS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.apps.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className="sidebar-nav-item sidebar-transition"
                  >
                    <Link href={item.path} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          {navigationItems.bottom.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "sidebar-nav-item sidebar-transition",
                  item.active && "active"
                )}
              >
                <Link href={item.path} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// Main AppSidebar Component
export function AppSidebar() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Desktop: Sticky Regular Div */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      {/* Mobile: Sidebar Component */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>
    </>
  );
}
