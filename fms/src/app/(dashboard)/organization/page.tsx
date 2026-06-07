"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2 } from "lucide-react"

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Organization Structure" 
        description="Manage departments and hierarchical groupings."
      />
      <EmptyState 
        icon={Building2}
        title="Departments"
        description="Department management is under construction."
      />
    </div>
  )
}
