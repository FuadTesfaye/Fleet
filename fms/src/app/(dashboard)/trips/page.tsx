"use client"

import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useTripStore } from "@/store/trip.store"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { usePermission } from "@/lib/permissions"

export default function TripsPage() {
  const trips = useTripStore((s) => s.trips)
  const canCreate = usePermission("vehicles.dispatch")

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Trips & Routes" 
        description="Monitor active and completed trips across all regional offices."
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {canCreate && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </Button>
            )}
          </div>
        }
      />

      <DataTable 
        columns={columns} 
        data={trips} 
        searchKey="purpose" 
        searchPlaceholder="Search by purpose..." 
      />
    </div>
  )
}
