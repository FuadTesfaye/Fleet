"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Route } from "lucide-react"

export default function GeoRoutePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Geo Route" 
        description="Corridor line configurations for tracking route deviations."
      />
      <EmptyState 
        icon={Route}
        title="Spatial Lines"
        description="Configure path boundaries using LINESTRING coordinates."
      />
    </div>
  )
}
