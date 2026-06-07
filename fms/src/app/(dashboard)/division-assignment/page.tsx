"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ClipboardList } from "lucide-react"

export default function DivisionAssignmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Division Assignment" 
        description="Allocate driver-vehicle units to specific divisions."
      />
      <EmptyState 
        icon={ClipboardList}
        title="Division Resources"
        description="Dedicated fleet units allocated per administrative department."
      />
    </div>
  )
}
