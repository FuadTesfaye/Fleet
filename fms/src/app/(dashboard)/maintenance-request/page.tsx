"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Wrench } from "lucide-react"

export default function MaintenanceRequestPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Maintenance Requests" 
        description="Verify service requirements and request repairs."
      />
      <EmptyState 
        icon={Wrench}
        title="Repair Requests Queue"
        description="Vehicles are set to OnMaintenance when requests are opened."
      />
    </div>
  )
}
