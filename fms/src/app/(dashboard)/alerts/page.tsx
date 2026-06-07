"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Bell } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Alerts" 
        description="Review and dismiss automated system notifications."
      />
      <EmptyState 
        icon={Bell}
        title="Alerts Overview"
        description="Detailed alerts view is under construction."
      />
    </div>
  )
}
