"use client"

import type React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  TooltipProvider,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Home, User, Users, Building2, MapPin, ChevronDown, Search, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useParams, usePathname } from "next/navigation"

const navigationItemsAdmin = [
  { name: "Dashboard", icon: Home, path: "" },
  { name: "Profile", icon: User, path: "/profile" },
  {
    name: "Employees",
    icon: Users,
    path: "/employees",
    submenu: [
      { name: "Manage Employee", path: "/employees/manage" },
      { name: "Assign Employee", path: "/employees/assign" },
      { name: "Attendance List", path: "/employees/attendance" },
      { name: "Requested Edit Attendance", path: "/employees/attendance-requests" },
    ],
  },
  {
    name: "Structure",
    icon: Building2,
    path: "/structure",
    submenu: [
      { name: "Divsions", path: "/structure/divisions" },
      { name: "Sub-Divisions", path: "/structure/sub-divisions" },
    ],
  },
  { name: "Branch", icon: MapPin, path: "/branch" },
]

const navigationItemsEmployee = [
  { name: "Dashboard", icon: Home, path: "" },
  { name: "Profile", icon: User, path: "/my/profile" },
  { name: "Attendance", icon: Users, path: "/my/attendance" },
  { name: "Department Group", icon: Users, path: "/my/department" },
]

// keep backwards-compatibility default if needed
const defaultNavigationItems = navigationItemsAdmin

// Desktop Sidebar Component (Regular Div with Sticky)
function DesktopSidebar({ navigationItems = defaultNavigationItems }: { navigationItems?: typeof navigationItemsAdmin }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed")
      return saved === "true"
    }
    return false
  })
  const params = useParams()
  const pathname = usePathname()
  const locale = params?.locale as string
  const company = params?.company as string
  const basePath = `/${locale}/${company}`

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isCollapsed))
  }, [isCollapsed])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (!isCollapsed) {
      setExpandedItems([])
    }
  }

  const isActive = (path: string) => {
    const fullPath = `${basePath}${path}`
    return pathname === fullPath
  }

  const MenuItemWrapper = ({
    children,
    label,
    isCollapsed,
  }: { children: React.ReactNode; label: string; isCollapsed: boolean }) => {
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    return <>{children}</>
  }

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out sticky top-16 h-[calc(100vh-4rem)] overflow-hidden",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-3 border-b border-sidebar-border flex items-center gap-2">
        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center p-2 hover:bg-sidebar-accent rounded-md transition-colors flex-shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-sidebar-foreground" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-sidebar-foreground" />
          )}
        </button>

        {/* {!isCollapsed && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 bg-sidebar-accent/50 border border-sidebar-border rounded-md text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
          </div>
        )} */}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const fullPath = `${basePath}${item.path}`
            const itemIsActive = isActive(item.path)

            return (
              <div key={item.name}>
                {item.submenu ? (
                  <MenuItemWrapper label={item.name} isCollapsed={isCollapsed}>
                    <button
                      onClick={() => !isCollapsed && toggleExpanded(item.name)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                        isCollapsed ? "justify-center" : "",
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              expandedItems.includes(item.name) && "rotate-180",
                            )}
                          />
                        </>
                      )}
                    </button>
                  </MenuItemWrapper>
                ) : (
                  <MenuItemWrapper label={item.name} isCollapsed={isCollapsed}>
                    <Link
                      href={fullPath}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                        itemIsActive &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        isCollapsed ? "justify-center" : "",
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </MenuItemWrapper>
                )}

                {item.submenu && expandedItems.includes(item.name) && !isCollapsed && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                      const subFullPath = `${basePath}${subItem.path}`
                      const subIsActive = isActive(subItem.path)

                      return (
                        <Link
                          key={subItem.name}
                          href={subFullPath}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80",
                            subIsActive && "bg-primary/10 text-primary font-medium",
                          )}
                        >
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Mobile Sidebar Component (Using Sidebar Component)
function MobileSidebar({ navigationItems = defaultNavigationItems }: { navigationItems?: typeof navigationItemsAdmin }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const params = useParams()
  const pathname = usePathname()
  const locale = params?.locale as string
  const company = params?.company as string
  const basePath = `/${locale}/${company}`

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const isActive = (path: string) => {
    const fullPath = `${basePath}${path}`
    return pathname === fullPath
  }

  return (
    <TooltipProvider>
      <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
            <SidebarInput
              placeholder="Search"
              className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
            />
          </div> */}
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const fullPath = `${basePath}${item.path}`
                  const itemIsActive = isActive(item.path)

                  return (
                    <div key={item.name}>
                      <SidebarMenuItem>
                        {item.submenu ? (
                          <SidebarMenuButton
                            className="sidebar-nav-item sidebar-transition"
                            onClick={() => toggleExpanded(item.name)}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span>{item.name}</span>
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 ml-auto transition-transform",
                                expandedItems.includes(item.name) && "rotate-180",
                              )}
                            />
                          </SidebarMenuButton>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "sidebar-nav-item sidebar-transition",
                              itemIsActive &&
                                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            )}
                          >
                            <Link href={fullPath} className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 flex-shrink-0" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>

                      {item.submenu && expandedItems.includes(item.name) && (
                        <div className="ml-7 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const subFullPath = `${basePath}${subItem.path}`
                            const subIsActive = isActive(subItem.path)

                            return (
                              <SidebarMenuItem key={subItem.name}>
                                <SidebarMenuButton
                                  asChild
                                  className={cn(
                                    "sidebar-nav-item sidebar-transition",
                                    subIsActive && "bg-primary/10 text-primary font-medium",
                                  )}
                                >
                                  <Link href={subFullPath} className="text-sm text-sidebar-foreground/80">
                                    {subItem.name}
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}

// Main AppSidebar Component
export function AppSidebar({ role = "admin" }: { role?: "admin" | "employee" }) {
  const isMobile = useIsMobile()
  const items = role === "employee" ? navigationItemsEmployee : navigationItemsAdmin

  return (
    <>
      <div className="hidden md:block">
        <DesktopSidebar navigationItems={items} />
      </div>

      <div className="md:hidden">
        <MobileSidebar navigationItems={items} />
      </div>
    </>
  )
}
