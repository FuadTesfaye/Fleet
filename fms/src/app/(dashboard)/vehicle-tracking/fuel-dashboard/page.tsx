"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Fuel } from "lucide-react"

export default function FuelDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fuel Dashboard" 
        description="Monitor sensor values to detect theft or excess usage."
      />
      <EmptyState 
        icon={Fuel}
        title="Fuel Sensor Telemetry"
        description="Calculates real-time fuel reserves based on live GPS feeds."
      />
    </div>
  )
}
