"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { getColumns } from "./columns"
import { useVehicleStore } from "@/store/vehicle.store"
import { useDivisionStore } from "@/store/division.store"
import { Vehicle } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function DivisionAssignmentPage() {
  const vehicles = useVehicleStore((s) => s.vehicles)
  const updateVehicle = useVehicleStore((s) => s.updateVehicle)
  const divisions = useDivisionStore((s) => s.divisions)

  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null)
  const [open, setOpen] = React.useState(false)
  const [selectedDeptId, setSelectedDeptId] = React.useState<string>("")

  const handleOpenReallocate = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setSelectedDeptId(vehicle.departmentId || "")
    setOpen(true)
  }

  const handleConfirmReallocate = () => {
    if (!selectedVehicle || !selectedDeptId) {
      toast.error("Please select a division")
      return
    }

    updateVehicle(selectedVehicle.id, {
      departmentId: selectedDeptId,
    })

    const divisionName = divisions.find((d) => d.id === selectedDeptId)?.name || "selected division"
    toast.success(`Vehicle successfully reallocated to ${divisionName}`)
    setOpen(false)
    setSelectedVehicle(null)
  }

  const columns = getColumns({
    onReallocate: handleOpenReallocate,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Division Resource Allocation"
        description="Allocate and transfer active transport vehicles to specific ministry departments and regional divisions."
      />

      <DataTable
        columns={columns}
        data={vehicles}
        searchKey="plateNumber"
        searchPlaceholder="Search by plate number..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reallocate Vehicle Division</DialogTitle>
            <DialogDescription>
              Assign vehicle{" "}
              <span className="font-semibold text-foreground">
                {selectedVehicle?.plateNumber} ({selectedVehicle?.make} {selectedVehicle?.model})
              </span>{" "}
              to an administrative department.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="division" className="text-right">
                Division
              </Label>
              <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department..." />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReallocate} disabled={!selectedDeptId}>
              Confirm Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
