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
  HelpCircle,
  Play,
  ChevronDown,
  Search,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

/* ======================
   Type Definitions
====================== */
type NavChild = {
  name: string;
  path: string;
};

type NavItem = {
  name: string;
  icon: LucideIcon;
  path?: string;
  active?: boolean;
  children?: NavChild[];
};

type NavigationItems = {
  feature: NavItem[];
  company: NavItem[];
  apps: NavItem[];
  bottom: NavItem[];
};

/* ======================
   Base Navigation Items
====================== */
const baseNavigationItems: NavigationItems = {
  feature: [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Time-off", icon: Clock, path: "/time-off" },
    {
      name: "Tasks",
      icon: CheckSquare,
      children: [
        { name: "Task List", path: "/tasks" },
        { name: "Create Task", path: "/tasks/create" },
      ],
    },
  ],
  company: [
    { name: "Employees", icon: Users, path: "/employees" },
    {
      name: "Organization",
      icon: Users,
      children: [
        { name: "Division", path: "/divisions" },
        { name: "Sub-Division", path: "/sub-divisions" },
      ],
    },
    { name: "Calendar", icon: Calendar, path: "/calendar" },
    { name: "Files", icon: Folder, path: "/files" },
    { name: "Report", icon: BarChart3, path: "/reports" },
  ],
  apps: [
    {
      name: "Integrations",
      icon: MessageSquare,
      children: [
        { name: "Slack", path: "/apps/slack" },
        { name: "Github", path: "/apps/github" },
      ],
    },
  ],
  bottom: [
    { name: "Support Center", icon: HelpCircle, path: "/support" },
    { name: "Getting Started", icon: Play, path: "/getting-started", active: true },
  ],
};

/* ======================
   Prefix Helper
====================== */
function prefixNavigationItems(
  baseItems: NavigationItems,
  prefix: string
): NavigationItems {
  const addPrefix = (path?: string): string | undefined => {
    if (!path) return undefined;
    return path === "/" ? `${prefix}` : `${prefix}${path}`;
  };

  const mapItem = (item: NavItem): NavItem => ({
    ...item,
    path: addPrefix(item.path),
    children: item.children?.map((child): NavChild => ({
      ...child,
      path: addPrefix(child.path)!,
    })),
  });

  return {
    feature: baseItems.feature.map(mapItem),
    company: baseItems.company.map(mapItem),
    apps: baseItems.apps.map(mapItem),
    bottom: baseItems.bottom.map(mapItem),
  };
}

/* ======================
   Desktop Sidebar
====================== */
function DesktopSidebar() {
  const { locale, company } = useParams<{ locale: string; company: string }>();
  const navigationItems = prefixNavigationItems(baseNavigationItems, `/${locale}/${company}`);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <div key={item.name}>
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            onClick={() => toggleExpanded(item.name)}
          >
            <item.icon className="w-4 h-4" />
            {!isCollapsed && <span>{item.name}</span>}
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 ml-auto transition-transform",
                  expandedItems.includes(item.name) && "rotate-180"
                )}
              />
            )}
          </div>
          {expandedItems.includes(item.name) && !isCollapsed && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  href={child.path}
                  className="block px-3 py-1 text-sm text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.path!}
        className={cn(
          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          item.active && "bg-sidebar-primary text-sidebar-primary-foreground",
          isCollapsed && "justify-center"
        )}
        title={isCollapsed ? item.name : undefined}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    );
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
        <div className={cn("transition-all duration-300", isCollapsed && "hidden")}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
            <input
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-sidebar-accent/50 border border-sidebar-border rounded-md text-sidebar-foreground placeholder:text-sidebar-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
          </div>
        </div>
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
          {!isCollapsed && (
            <div className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              FEATURE
            </div>
          )}
          <div className="space-y-1">
            {navigationItems.feature.map(renderNavItem)}
          </div>
        </div>

        {/* Company Section */}
        <div className="p-4">
          {!isCollapsed && (
            <div className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              COMPANY
            </div>
          )}
          <div className="space-y-1">
            {navigationItems.company.map(renderNavItem)}
          </div>
        </div>

        {/* Apps Section */}
        <div className="p-4">
          {!isCollapsed && (
            <div className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              APPS
            </div>
          )}
          <div className="space-y-1">
            {navigationItems.apps.map(renderNavItem)}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0 bg-sidebar">
        <div className="space-y-1">
          {navigationItems.bottom.map(renderNavItem)}
        </div>
      </div>
    </div>
  );
}

/* ======================
   Mobile Sidebar
====================== */
function MobileSidebar() {
  const { locale, company } = useParams<{ locale: string; company: string }>();
  const navigationItems = prefixNavigationItems(baseNavigationItems, `/${locale}/${company}`);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderMobileNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <SidebarMenuItem key={item.name}>
          <div
            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => toggleExpanded(item.name)}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 ml-auto transition-transform",
                expandedItems.includes(item.name) && "rotate-180"
              )}
            />
          </div>
          {expandedItems.includes(item.name) && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  href={child.path}
                  className="block px-3 py-1 text-sm text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.name}>
        <SidebarMenuButton asChild>
          <Link href={item.path!} className="flex items-center gap-3">
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar">
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
        {/* Feature Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-section-title">FEATURE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{navigationItems.feature.map(renderMobileNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Company Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-section-title">COMPANY</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{navigationItems.company.map(renderMobileNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Apps Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-section-title">APPS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{navigationItems.apps.map(renderMobileNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>{navigationItems.bottom.map(renderMobileNavItem)}</SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

/* ======================
   Main AppSidebar
====================== */
export function AppSidebar() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <div className="md:hidden">
        <MobileSidebar />
      </div>
    </>
  );
}
