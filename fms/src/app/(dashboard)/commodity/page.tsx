"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Package } from "lucide-react"

export default function CommodityPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Commodity List" 
        description="Define and categorize cargo types."
      />
      <EmptyState 
        icon={Package}
        title="Commodities catalog"
        description="Registry of freight loads supported by company vehicles."
      />
    </div>
  )
}
