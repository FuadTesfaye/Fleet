"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Settings } from "lucide-react"

export default function AdministrationPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Role Management" 
        description="Configure role-based access control and system permissions."
      />
      <EmptyState 
        icon={Settings}
        title="Access Policies"
        description="Granular permission mapping to system roles."
      />
    </div>
  )
}
