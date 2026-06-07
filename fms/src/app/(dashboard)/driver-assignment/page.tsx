"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { getColumns } from "./columns"
import { useVehicleStore } from "@/store/vehicle.store"
import { useDriverStore } from "@/store/driver.store"
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

export default function DriverAssignmentPage() {
  const vehicles = useVehicleStore((s) => s.vehicles)
  const updateVehicle = useVehicleStore((s) => s.updateVehicle)
  
  const drivers = useDriverStore((s) => s.drivers)
  const updateDriver = useDriverStore((s) => s.updateDriver)

  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null)
  const [open, setOpen] = React.useState(false)
  const [selectedDriverId, setSelectedDriverId] = React.useState<string>("")

  // Filter available drivers (those without a vehicle assigned and are active)
  const availableDrivers = drivers.filter((d) => !d.assignedVehicleId && d.isActive)

  const handleOpenAssign = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setSelectedDriverId("")
    setOpen(true)
  }

  const handleConfirmAssign = () => {
    if (!selectedVehicle || !selectedDriverId) {
      toast.error("Please select a driver")
      return
    }

    // 1. Assign driver to vehicle
    updateVehicle(selectedVehicle.id, {
      assignedDriverId: selectedDriverId,
    })

    // 2. Assign vehicle to driver
    updateDriver(selectedDriverId, {
      assignedVehicleId: selectedVehicle.id,
    })

    toast.success(`Driver successfully assigned to ${selectedVehicle.plateNumber}`)
    setOpen(false)
    setSelectedVehicle(null)
  }

  const handleUnassign = (vehicle: Vehicle) => {
    const driverId = vehicle.assignedDriverId
    if (!driverId) return

    // 1. Remove driver from vehicle
    updateVehicle(vehicle.id, {
      assignedDriverId: undefined,
    })

    // 2. Remove vehicle from driver
    updateDriver(driverId, {
      assignedVehicleId: undefined,
    })

    toast.success("Driver unassigned successfully")
  }

  const columns = getColumns({
    onAssign: handleOpenAssign,
    onUnassign: handleUnassign,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver-Vehicle Pairs"
        description="Pair active transport vehicles with certified drivers and manage shift assignments."
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
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Select an available driver to pair with vehicle{" "}
              <span className="font-semibold text-foreground">
                {selectedVehicle?.plateNumber} ({selectedVehicle?.make} {selectedVehicle?.model})
              </span>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver" className="text-right">
                Driver
              </Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select available driver..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 text-center">
                      No available drivers
                    </div>
                  ) : (
                    availableDrivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.licenseClass})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={!selectedDriverId}>
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
