"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Users } from "lucide-react"

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="Manage user directory, profiles, and active registrations."
      />
      <EmptyState 
        icon={Users}
        title="Account Users"
        description="Core user registry handles authentication details."
      />
    </div>
  )
}
