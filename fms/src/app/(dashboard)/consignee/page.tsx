"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2 } from "lucide-react"

export default function ConsigneePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Consignee Management" 
        description="Configure cargo targets or destination entities."
      />
      <EmptyState 
        icon={Building2}
        title="Consignees Registry"
        description="Target endpoints for physical cargo shipments."
      />
    </div>
  )
}
