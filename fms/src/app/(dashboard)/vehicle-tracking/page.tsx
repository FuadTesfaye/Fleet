"use client"

import dynamic from "next/dynamic"
import { PageHeader } from "@/components/layout/page-header"

// Dynamically import TrackingMap with SSR disabled to prevent Leaflet window reference error
const TrackingMap = dynamic(() => import("./TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full border rounded-lg bg-muted flex items-center justify-center animate-pulse">
      <span className="text-muted-foreground font-medium">Initializing Map Engine...</span>
    </div>
  )
})

export default function LiveTrackingPage() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader 
        title="Live Tracking" 
        description="Real-time OpenStreetMap / Leaflet view of active fleet vehicles."
      />
      <TrackingMap />
    </div>
  )
}
