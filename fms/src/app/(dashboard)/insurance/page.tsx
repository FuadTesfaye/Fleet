"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Shield } from "lucide-react"

export default function InsurancePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Insurance & Policies" 
        description="Manage fleet insurance coverage and claims."
      />
      <EmptyState 
        icon={Shield}
        title="Insurance Claims"
        description="Insurance management is under construction."
      />
    </div>
  )
}
