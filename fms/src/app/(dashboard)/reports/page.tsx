"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { BarChart3 } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics & Reports" 
        description="Generate standard and custom fleet reports."
      />
      <EmptyState 
        icon={BarChart3}
        title="Reporting Engine"
        description="Custom reporting tools are under construction."
      />
    </div>
  )
}
