"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Settings,
  Users,
  ClipboardList,
  FileText,
  FileCheck,
  FileSpreadsheet,
  Map,
  MapPin,
  Shield,
  Truck,
  UserCheck,
  Wrench,
  Package,
  LogOut,
  ChevronUp,
  ChevronRight,
  Building2,
  FolderOpen,
  Route,
  Navigation,
  Fuel,
  Link2,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/auth.store"
import { ROLE_LABELS, UserRole } from "@/types"

export type NavItem = {
  title: string
  url: string
  icon: any
  allowedRoles?: UserRole[]
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const data: { navGroups: NavGroup[] } = {
  navGroups: [
    {
      title: "OVERVIEW",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboardIcon,
        },
      ],
    },
    {
      title: "RESOURCE MANAGEMENT",
      items: [
        {
          title: "Company Management",
          url: "/company",
          icon: Building2,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER],
        },
        {
          title: "Division Management",
          url: "/division",
          icon: FolderOpen,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER],
        },
        {
          title: "Vehicle Management",
          url: "/vehicles",
          icon: Truck,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER, UserRole.TRANSPORT_DEPLOYMENT_EXPERT, UserRole.MAINTENANCE_EXPERT],
        },
        {
          title: "Driver Management",
          url: "/drivers",
          icon: UserCheck,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
      ],
    },
    {
      title: "ACCOUNT MANAGEMENT",
      items: [
        {
          title: "User Management",
          url: "/account",
          icon: Users,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER, UserRole.ICT_DEPARTMENT],
        },
        {
          title: "Role Management",
          url: "/administration",
          icon: Settings,
          allowedRoles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
    {
      title: "ASSIGNMENT MANAGEMENT",
      items: [
        {
          title: "Driver Assignment",
          url: "/driver-assignment",
          icon: Link2,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD],
        },
        {
          title: "Division Assignment",
          url: "/division-assignment",
          icon: ClipboardList,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD],
        },
        {
          title: "Request Assignment",
          url: "/request-assignment",
          icon: ClipboardList,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
      ],
    },
    {
      title: "REQUEST MANAGEMENT",
      items: [
        {
          title: "User Requests",
          url: "/request",
          icon: FileText,
          // No allowedRoles = all roles can request transport
        },
      ],
    },
    {
      title: "VEHICLE REQUEST MANAGEMENT",
      items: [
        {
          title: "Vehicle Request",
          url: "/vehicle-request-order",
          icon: FileCheck,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER, UserRole.TRANSPORT_DEPLOYMENT_HEAD],
        },
      ],
    },
    {
      title: "REQUEST ORDER ASSIGNMENT",
      items: [
        {
          title: "Request Order Assignment",
          url: "/request-order-assignment",
          icon: FileSpreadsheet,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Assignment Change",
          url: "/request-order-assignment/change",
          icon: FileSpreadsheet,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Request History",
          url: "/vehicle-request-order/history",
          icon: FileSpreadsheet,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Request Approval",
          url: "/vehicle-request-order/approve",
          icon: FileCheck,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER, UserRole.TRANSPORT_DEPLOYMENT_HEAD],
        },
      ],
    },
    {
      title: "TRACKING MANAGEMENT",
      items: [
        {
          title: "Live Tracking",
          url: "/vehicle-tracking",
          icon: Navigation,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "History Tracking",
          url: "/vehicle-tracking-history",
          icon: Map,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Show Fuel in Dashboard",
          url: "/vehicle-tracking/fuel-dashboard",
          icon: Fuel,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.BASIC_SERVICE_MANAGER, UserRole.TRANSPORT_DEPLOYMENT_HEAD],
        },
      ],
    },
    {
      title: "GEO MANAGEMENT",
      items: [
        {
          title: "Geo Fence",
          url: "/geofence",
          icon: MapPin,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Geo Route",
          url: "/georoute",
          icon: Route,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_HEAD, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
      ],
    },
    {
      title: "FREIGHT ORDER MANAGEMENT",
      items: [
        {
          title: "Freight Order",
          url: "/freight-order",
          icon: Route,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Shipper",
          url: "/shipper",
          icon: Building2,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Consignee",
          url: "/consignee",
          icon: Building2,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Commodity",
          url: "/commodity",
          icon: Package,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Tariff",
          url: "/tariff",
          icon: FileText,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TRANSPORT_DEPLOYMENT_EXPERT],
        },
        {
          title: "Fuel Refilled",
          url: "/fuel-refilled",
          icon: Fuel,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.DRIVER, UserRole.BASIC_SERVICE_MANAGER],
        },
      ],
    },
    {
      title: "MAINTENANCE MANAGEMENT",
      items: [
        {
          title: "Maintenance Request",
          url: "/maintenance-request",
          icon: Wrench,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.DRIVER, UserRole.MAINTENANCE_EXPERT, UserRole.BASIC_SERVICE_MANAGER],
        },
      ],
    },
    {
      title: "MAINTENANCE MATERIAL LIST",
      items: [
        {
          title: "Material List LookUp",
          url: "/maintenance-material-list",
          icon: Package,
          allowedRoles: [UserRole.SUPER_ADMIN, UserRole.MAINTENANCE_EXPERT],
        },
      ],
    },
  ],
}

function LayoutDashboardIcon(props: React.ComponentProps<typeof Link2>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-layout-dashboard"
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="10" rx="1" />
      <rect width="7" height="5" x="3" y="14" rx="1" />
    </svg>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout, switchRole } = useAuthStore()
  const router = useRouter()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const roles: UserRole[] = [
    UserRole.SUPER_ADMIN,
    UserRole.BASIC_SERVICE_MANAGER,
    UserRole.TRANSPORT_DEPLOYMENT_HEAD,
    UserRole.TRANSPORT_DEPLOYMENT_EXPERT,
    UserRole.MAINTENANCE_EXPERT,
    UserRole.DRIVER,
    UserRole.ICT_DEPARTMENT,
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg flex-shrink-0">
            <Truck size={24} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold truncate">IFMS PRO</span>
            <span className="text-xs text-muted-foreground truncate">Ministry of Irrigation</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => {
          const visibleItems = group.items.filter(item => 
            !item.allowedRoles || item.allowedRoles.includes(user.role)
          )

          if (visibleItems.length === 0) return null

          return (
            <Collapsible
              key={group.title}
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground [&>svg]:size-4 [&>svg]:shrink-0">
                    <span>{group.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {visibleItems.map((item) => {
                        const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                              <Link href={item.url}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{ROLE_LABELS[user.role]}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Dev: Switch Role</DropdownMenuLabel>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => switchRole(role)}
                    className={user.role === role ? "bg-accent" : ""}
                  >
                    {ROLE_LABELS[role]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
