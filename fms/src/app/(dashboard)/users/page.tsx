"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Users } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="Manage system access, roles, and permissions."
      />
      <EmptyState 
        icon={Users}
        title="User Directory"
        description="User management is restricted and under construction."
      />
    </div>
  )
}
