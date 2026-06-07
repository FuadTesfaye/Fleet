"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileCheck } from "lucide-react"

export default function VehicleRequestOrderPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vehicle Request Orders" 
        description="Cargo, logistical, and multi-destination dispatch requests."
      />
      <EmptyState 
        icon={FileCheck}
        title="Request Orders Console"
        description="Submit and track comprehensive logistics orders."
      />
    </div>
  )
}
