"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Package } from "lucide-react"

export default function MaintenanceMaterialListPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Material List LookUp" 
        description="Workshop inventories and stock levels of replacement spare parts."
      />
      <EmptyState 
        icon={Package}
        title="Workshop Inventory Catalog"
        description="Standard parts lookup used to track repair costs."
      />
    </div>
  )
}
