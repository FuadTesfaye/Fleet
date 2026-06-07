"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileCheck } from "lucide-react"

export default function RequestApprovalPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Request Approval" 
        description="Verify, sign off, or decline pending vehicle request orders."
      />
      <EmptyState 
        icon={FileCheck}
        title="Approvals Console"
        description="Authorize logistical orders for field trips."
      />
    </div>
  )
}
