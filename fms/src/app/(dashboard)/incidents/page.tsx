"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { AlertTriangle } from "lucide-react"

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Incidents & Accidents" 
        description="Log and track vehicle damage and accidents."
      />
      <EmptyState 
        icon={AlertTriangle}
        title="Incidents Log"
        description="Incidents tracking is under construction."
      />
    </div>
  )
}
