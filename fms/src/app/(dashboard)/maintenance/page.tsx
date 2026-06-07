"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Wrench } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Maintenance Overview" 
        description="Manage work orders, spare parts, and service requests."
      />
      <EmptyState 
        icon={Wrench}
        title="Maintenance Dashboard"
        description="Detailed maintenance view is under construction."
      />
    </div>
  )
}
