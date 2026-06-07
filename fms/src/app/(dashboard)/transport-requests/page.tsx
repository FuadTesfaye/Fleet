"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ClipboardList } from "lucide-react"

export default function TransportRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Transport Requests" 
        description="Manage and approve vehicle requests for field trips and operations."
      />
      <EmptyState 
        icon={ClipboardList}
        title="Transport Requests"
        description="Transport requests management is under construction."
      />
    </div>
  )
}
