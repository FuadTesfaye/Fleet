"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Map } from "lucide-react"

export default function GeofencePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Geofences" 
        description="Define and manage operational boundaries."
      />
      <EmptyState 
        icon={Map}
        title="Geofence Management"
        description="Geofencing rules configuration is under construction."
      />
    </div>
  )
}
