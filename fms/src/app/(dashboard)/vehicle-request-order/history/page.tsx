"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileSpreadsheet } from "lucide-react"

export default function RequestHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Request Assignment History" 
        description="Audits and metrics for completed and rejected transport orders."
      />
      <EmptyState 
        icon={FileSpreadsheet}
        title="Logistics Archives"
        description="Search past trips, distance, fuel efficiency, and dispatch outcomes."
      />
    </div>
  )
}
