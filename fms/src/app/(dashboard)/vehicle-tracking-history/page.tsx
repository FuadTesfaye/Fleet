"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Map } from "lucide-react"

export default function HistoryTrackingPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="History Tracking" 
        description="Select date corridors to trace route tracks."
      />
      <EmptyState 
        icon={Map}
        title="Path Trace Mapping"
        description="Select vehicles to load historically traveled GPS lines."
      />
    </div>
  )
}
