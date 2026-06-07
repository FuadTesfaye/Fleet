"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2 } from "lucide-react"

export default function CompanyPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Company Management" 
        description="Register and manage logisitic nodes and agencies."
      />
      <EmptyState 
        icon={Building2}
        title="Company Directory"
        description="Company details and logistics nodes configuration."
      />
    </div>
  )
}
