"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Link2 } from "lucide-react"

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vehicle Assignments" 
        description="Manage driver-to-vehicle pairing and historical logs."
      />
      <EmptyState 
        icon={Link2}
        title="Assignments"
        description="Assignments management is under construction."
      />
    </div>
  )
}
