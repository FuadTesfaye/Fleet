"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Route } from "lucide-react"

export default function FreightOrderPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Freight Orders" 
        description="Cargo shipping logs, rates, and approval cycles."
      />
      <EmptyState 
        icon={Route}
        title="Logistics Manifests"
        description="Multi-tier sign-off flows (Leader, Manager, Director) for cargo dispatches."
      />
    </div>
  )
}
