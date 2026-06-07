"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { data } from "./app-sidebar"
import { Loader2 } from "lucide-react"

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // If we're not checking auth yet or don't have a user, wait.
    // The middleware handles basic unauthenticated redirects, but we double check.
    if (!isAuthenticated || !user) {
      return
    }

    // Dashboard root is always accessible
    if (pathname === "/dashboard") {
      setIsAuthorized(true)
      return
    }

    // Check if the current pathname is allowed for the user's role
    let isPathFound = false
    let isRoleAllowed = false

    for (const group of data.navGroups) {
      for (const item of group.items) {
        if (pathname === item.url || pathname.startsWith(`${item.url}/`)) {
          isPathFound = true
          if (!item.allowedRoles || item.allowedRoles.includes(user.role)) {
            isRoleAllowed = true
          }
          break
        }
      }
      if (isPathFound) break
    }

    // If the path is not in our nav list at all, we assume it's a safe internal route (or handle differently)
    // But if it IS in our list, and the role is NOT allowed, block them.
    if (isPathFound && !isRoleAllowed) {
      setIsAuthorized(false)
      router.replace("/dashboard")
    } else {
      setIsAuthorized(true)
    }
  }, [pathname, user, isAuthenticated, router])

  if (isAuthorized === null) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isAuthorized === false) {
    return null // They are being redirected
  }

  return <>{children}</>
}
