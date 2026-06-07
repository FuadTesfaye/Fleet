"use client"

import * as React from "react"
import { Bell, Search } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useNotificationStore } from "@/store/notification.store"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export function Topbar() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)
  const unreadCount = useNotificationStore((s) => s.unreadCount())
  const alerts = useNotificationStore((s) => s.alerts)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">MILL FMS</BreadcrumbLink>
            </BreadcrumbItem>
            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join("/")}`
              const isLast = index === paths.length - 1
              const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")

              if (path === "dashboard") return null

              return (
                <React.Fragment key={path}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vehicles, drivers..."
            className="w-64 rounded-full bg-background pl-8"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-white"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <h4 className="font-semibold">Notifications</h4>
              <Badge variant="secondary">{unreadCount} unread</Badge>
            </div>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">{alert.title}</span>
                  <span className="text-muted-foreground line-clamp-2">{alert.message}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t text-center">
              <Button variant="link" size="sm" className="w-full" asChild>
                <a href="/alerts">View all alerts</a>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
