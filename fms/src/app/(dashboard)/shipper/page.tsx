"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2 } from "lucide-react"

export default function ShipperPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Shipper Management" 
        description="Configure shippers or source entities."
      />
      <EmptyState 
        icon={Building2}
        title="Shippers Registry"
        description="Source details for cargo dispatch systems."
      />
    </div>
  )
}
