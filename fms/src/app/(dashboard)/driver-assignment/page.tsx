"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Link2 } from "lucide-react"

export default function DriverAssignmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Driver Assignment" 
        description="Bind active drivers to fleet vehicles."
      />
      <EmptyState 
        icon={Link2}
        title="Driver-Vehicle Pairs"
        description="Pairing drivers with physical transport vehicles."
      />
    </div>
  )
}
