"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { MapPin } from "lucide-react"

export default function TrackingPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Live Tracking" 
        description="Real-time map view of active fleet vehicles."
      />
      <EmptyState 
        icon={MapPin}
        title="Live Tracking Map"
        description="GPS tracking integration is currently mocked."
      />
    </div>
  )
}
