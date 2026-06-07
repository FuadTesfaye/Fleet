"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  Fuel,
  LayoutDashboard,
  Link2,
  Map,
  MapPin,
  Package,
  RefreshCcw,
  Route,
  SendHorizonal,
  Settings,
  Shield,
  Truck,
  UserCheck,
  Users,
  Wrench,
  LogOut,
  ChevronUp,
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
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/auth.store"
import { ROLE_LABELS, UserRole } from "@/types"
import { usePermission } from "@/lib/permissions"

// This is sample data.
const data = {
  navGroups: [
    {
      title: "OVERVIEW",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "FLEET",
      items: [
        {
          title: "Vehicles",
          url: "/vehicles",
          icon: Truck,
        },
        {
          title: "Drivers",
          url: "/drivers",
          icon: UserCheck,
        },
        {
          title: "Assignments",
          url: "/assignments",
          icon: Link2,
        },
        {
          title: "Live Tracking",
          url: "/tracking",
          icon: MapPin,
        },
        {
          title: "Geofence & Routes",
          url: "/geofence",
          icon: Map,
        },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        {
          title: "Transport Requests",
          url: "/transport-requests",
          icon: ClipboardList,
        },
        {
          title: "Dispatch",
          url: "/dispatch",
          icon: SendHorizonal,
        },
        {
          title: "Trips",
          url: "/trips",
          icon: Route,
        },
        {
          title: "Fuel Management",
          url: "/fuel",
          icon: Fuel,
        },
      ],
    },
    {
      title: "MAINTENANCE",
      items: [
        {
          title: "Overview",
          url: "/maintenance",
          icon: Wrench,
        },
        {
          title: "Work Orders",
          url: "/maintenance/work-orders",
          icon: Wrench,
        },
        {
          title: "Spare Parts",
          url: "/maintenance/spare-parts",
          icon: Package,
        },
        {
          title: "Replaced Items",
          url: "/maintenance/replaced-items",
          icon: RefreshCcw,
        },
      ],
    },
    {
      title: "INCIDENTS & INSURANCE",
      items: [
        {
          title: "Incidents",
          url: "/incidents",
          icon: AlertTriangle,
        },
        {
          title: "Insurance",
          url: "/insurance",
          icon: Shield,
        },
      ],
    },
    {
      title: "ANALYTICS",
      items: [
        {
          title: "Reports",
          url: "/reports",
          icon: BarChart3,
        },
        {
          title: "Alerts",
          url: "/alerts",
          icon: Bell,
        },
      ],
    },
    {
      title: "ADMINISTRATION",
      permission: "users.view", // Example: restrict whole group
      items: [
        {
          title: "User Management",
          url: "/users",
          icon: Users,
        },
        {
          title: "Organization",
          url: "/organization",
          icon: Building2,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout, switchRole } = useAuthStore()
  const router = useRouter()
  const canViewAdmin = usePermission("users.view")

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
            <span className="font-bold truncate">MILL FMS</span>
            <span className="text-xs text-muted-foreground truncate">Ministry of Irrigation</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => {
          if (group.permission && !canViewAdmin) return null

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
                            <item.icon />
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
