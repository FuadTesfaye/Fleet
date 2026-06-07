"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileText } from "lucide-react"

export default function TariffPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Freight Tariff Sheets" 
        description="Configure pricing levels and transit route costs."
      />
      <EmptyState 
        icon={FileText}
        title="Tariffs Catalogue"
        description="Tariff pricing structures for cargo deployments."
      />
    </div>
  )
}
