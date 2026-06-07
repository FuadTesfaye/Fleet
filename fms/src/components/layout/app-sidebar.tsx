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
  Building2,
  FolderOpen,
  Route,
  Navigation,
  Fuel,
  Link2,
} from "lucide-react"

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

const data = {
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
        },
        {
          title: "Division Management",
          url: "/division",
          icon: FolderOpen,
        },
        {
          title: "Vehicle Management",
          url: "/vehicles",
          icon: Truck,
        },
        {
          title: "Driver Management",
          url: "/drivers",
          icon: UserCheck,
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
        },
        {
          title: "Role Management",
          url: "/administration",
          icon: Settings,
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
        },
        {
          title: "Division Assignment",
          url: "/division-assignment",
          icon: ClipboardList,
        },
        {
          title: "Request Assignment",
          url: "/request-assignment",
          icon: ClipboardList,
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
        },
        {
          title: "Assignment Change",
          url: "/request-order-assignment/change",
          icon: FileSpreadsheet,
        },
        {
          title: "Request History",
          url: "/vehicle-request-order/history",
          icon: FileSpreadsheet,
        },
        {
          title: "Request Approval",
          url: "/vehicle-request-order/approve",
          icon: FileCheck,
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
        },
        {
          title: "History Tracking",
          url: "/vehicle-tracking-history",
          icon: Map,
        },
        {
          title: "Show Fuel in Dashboard",
          url: "/vehicle-tracking/fuel-dashboard",
          icon: Fuel,
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
        },
        {
          title: "Geo Route",
          url: "/georoute",
          icon: Route,
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
        },
        {
          title: "Shipper",
          url: "/shipper",
          icon: Building2,
        },
        {
          title: "Consignee",
          url: "/consignee",
          icon: Building2,
        },
        {
          title: "Commodity",
          url: "/commodity",
          icon: Package,
        },
        {
          title: "Tariff",
          url: "/tariff",
          icon: FileText,
        },
        {
          title: "Fuel Refilled",
          url: "/fuel-refilled",
          icon: Fuel,
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
    "super_admin",
    "basic_service_manager",
    "transport_deployment_head",
    "transport_deployment_expert",
    "maintenance_expert",
    "driver",
    "ict_department",
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
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
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
            </SidebarGroup>
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
