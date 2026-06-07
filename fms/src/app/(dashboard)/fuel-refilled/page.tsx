"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Fuel } from "lucide-react"

export default function FuelRefilledPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fuel Refilled Events" 
        description="Auditing fuel purchase transactions and coupons."
      />
      <EmptyState 
        icon={Fuel}
        title="Fuel Coupons Log"
        description="Verify fuel refills against active freight invoices."
      />
    </div>
  )
}
