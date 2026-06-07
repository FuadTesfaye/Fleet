"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SendHorizonal } from "lucide-react"

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dispatch Console" 
        description="Assign vehicles and drivers to approved transport requests."
      />
      <EmptyState 
        icon={SendHorizonal}
        title="Dispatch Console"
        description="Dispatch console is under construction."
      />
    </div>
  )
}
