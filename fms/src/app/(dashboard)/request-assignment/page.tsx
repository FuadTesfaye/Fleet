"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ClipboardList } from "lucide-react"

export default function RequestAssignmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Request Assignment" 
        description="Bind standard transport requests to assigned resources."
      />
      <EmptyState 
        icon={ClipboardList}
        title="Request Bindings"
        description="Connecting employee requests to ready drivers and vehicles."
      />
    </div>
  )
}
