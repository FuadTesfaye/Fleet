"use client"

import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useDriverStore } from "@/store/driver.store"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePermission } from "@/lib/permissions"

export default function DriversPage() {
  const drivers = useDriverStore((s) => s.drivers)
  const canCreate = usePermission("drivers.create")

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fleet Drivers" 
        description="Manage driver profiles, licenses, and performance metrics."
        action={
          canCreate ? (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Driver
            </Button>
          ) : null
        }
      />

      <DataTable 
        columns={columns} 
        data={drivers} 
        searchKey="name" 
        searchPlaceholder="Search drivers by name..." 
      />
    </div>
  )
}
