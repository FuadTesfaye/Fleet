"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileSpreadsheet } from "lucide-react"

export default function RequestOrderAssignmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Request Order Assignment" 
        description="Dispatch operator dashboard to allocate vehicle units to orders."
      />
      <EmptyState 
        icon={FileSpreadsheet}
        title="Logistics Dispatch"
        description="Match approved vehicle request orders to driver-vehicle pairings."
      />
    </div>
  )
}
