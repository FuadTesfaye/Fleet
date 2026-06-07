"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { data } from "./app-sidebar"
import { Loader2 } from "lucide-react"
import { UserRole } from "@/types"

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const isPublicRoute = pathname === "/login" || pathname === "/"

    // 1. Auth check
    if (!isAuthenticated) {
      if (!isPublicRoute) {
        setIsAuthorized(false)
        router.replace("/login")
      } else {
        setIsAuthorized(true)
      }
      return
    }

    // 2. Already authenticated, trying to access public routes
    if (isAuthenticated && isPublicRoute) {
      setIsAuthorized(false)
      router.replace("/dashboard")
      return
    }

    // 3. Admin-only routes (legacy middleware check)
    if (pathname.startsWith('/users') || pathname.startsWith('/organization')) {
      if (user?.role !== UserRole.SUPER_ADMIN) {
        setIsAuthorized(false)
        router.replace("/dashboard")
        return
      }
    }

    // 4. Dashboard root is always accessible
    if (pathname === "/dashboard") {
      setIsAuthorized(true)
      return
    }

    // 5. Sidebar-based RBAC
    let isPathFound = false
    let isRoleAllowed = false

    for (const group of data.navGroups) {
      for (const item of group.items) {
        if (pathname === item.url || pathname.startsWith(`${item.url}/`)) {
          isPathFound = true
          if (!item.allowedRoles || item.allowedRoles.includes(user!.role)) {
            isRoleAllowed = true
          }
          break
        }
      }
      if (isPathFound) break
    }

    if (isPathFound && !isRoleAllowed) {
      setIsAuthorized(false)
      router.replace("/dashboard")
    } else {
      setIsAuthorized(true)
    }
  }, [pathname, user, isAuthenticated, router, mounted])

  if (!mounted || isAuthorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isAuthorized === false) {
    return null // They are being redirected
  }

  return <>{children}</>
}
