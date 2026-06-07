"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Settings" 
        description="Configure global application preferences."
      />
      <EmptyState 
        icon={Settings}
        title="Preferences"
        description="System settings are under construction."
      />
    </div>
  )
}
