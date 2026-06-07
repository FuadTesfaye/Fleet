"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileSpreadsheet } from "lucide-react"

export default function RequestOrderAssignmentChangePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assignment Change" 
        description="Update active dispatches, release resources, or finish assignments."
      />
      <EmptyState 
        icon={FileSpreadsheet}
        title="Active Dispatch Controls"
        description="Modify drivers, vehicles, or conclude active route assignments."
      />
    </div>
  )
}
