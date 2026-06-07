"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Route } from "lucide-react"

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Trips & Routes" 
        description="Monitor active and completed trips across regions."
      />
      <EmptyState 
        icon={Route}
        title="Trips & Routes"
        description="Trips tracking is under construction."
      />
    </div>
  )
}
