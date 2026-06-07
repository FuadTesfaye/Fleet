"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileText } from "lucide-react"

export default function RequestPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Requests" 
        description="Employee console for transport requests and flight slips."
      />
      <EmptyState 
        icon={FileText}
        title="Transport Requests"
        description="Create, monitor, and print physical passenger request forms."
      />
    </div>
  )
}
