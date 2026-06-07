"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FolderOpen } from "lucide-react"

export default function DivisionPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Division Management" 
        description="Configure divisions and organizational departments."
      />
      <EmptyState 
        icon={FolderOpen}
        title="Divisions"
        description="Division structures are configured here."
      />
    </div>
  )
}
