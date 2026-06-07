"use client"

import { PageHeader } from "@/components/layout/page-header"
import { useFuelStore } from "@/store/fuel.store"
import { EmptyState } from "@/components/shared/empty-state"
import { Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePermission } from "@/lib/permissions"

export default function FuelManagementPage() {
  const fuelLogs = useFuelStore((s) => s.fuelLogs)
  const canRequest = usePermission("fuel.request")

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fuel Management" 
        description="Track fuel logs, consumption, and approve refill requests."
        action={
          canRequest ? (
            <Button>
              <Fuel className="w-4 h-4 mr-2" />
              Request Fuel
            </Button>
          ) : null
        }
      />

      {fuelLogs.length > 0 ? (
        <div className="text-muted-foreground p-8 text-center border rounded-lg bg-card/50">
          <p>Fuel logs table component would render here.</p>
          <p className="text-sm mt-2">Found {fuelLogs.length} logs.</p>
        </div>
      ) : (
        <EmptyState 
          icon={Fuel}
          title="No fuel logs found"
          description="There are currently no fuel logs or requests in the system."
        />
      )}
    </div>
  )
}
