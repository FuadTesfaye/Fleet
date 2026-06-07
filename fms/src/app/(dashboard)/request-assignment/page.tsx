"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { getColumns } from "./columns"
import { useRequestStore } from "@/store/request.store"
import { useVehicleStore } from "@/store/vehicle.store"
import { useDriverStore } from "@/store/driver.store"
import { TransportRequest } from "@/types"
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

export default function RequestAssignmentPage() {
  const requests = useRequestStore((s) => s.requests)
  const assignVehicleAndDriver = useRequestStore((s) => s.assignVehicleAndDriver)

  const vehicles = useVehicleStore((s) => s.vehicles)
  const drivers = useDriverStore((s) => s.drivers)

  const [selectedRequest, setSelectedRequest] = React.useState<TransportRequest | null>(null)
  const [open, setOpen] = React.useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string>("")
  const [selectedDriverId, setSelectedDriverId] = React.useState<string>("")

  // Filter vehicles that are not out of service or in maintenance
  const readyVehicles = vehicles.filter((v) => v.status === "active" || v.status === "idle")
  
  // Filter active drivers
  const activeDrivers = drivers.filter((d) => d.isActive)

  const handleOpenAssign = (request: TransportRequest) => {
    setSelectedRequest(request)
    setSelectedVehicleId("")
    setSelectedDriverId("")
    setOpen(true)
  }

  const handleConfirmAssign = () => {
    if (!selectedRequest || !selectedVehicleId || !selectedDriverId) {
      toast.error("Please select both a vehicle and a driver")
      return
    }

    assignVehicleAndDriver(selectedRequest.id, selectedVehicleId, selectedDriverId)
    toast.success("Vehicle and driver assigned to transport request successfully")
    setOpen(false)
    setSelectedRequest(null)
  }

  const columns = getColumns({
    onAssign: handleOpenAssign,
  })

  // Show only approved, in-progress, or completed requests for resource binding
  const filteredRequests = requests.filter(
    (r) => r.status === "approved" || r.status === "in_progress" || r.status === "completed"
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Bindings"
        description="Bind approved employee transport requests to available vehicles and drivers for field dispatch."
      />

      <DataTable
        columns={columns}
        data={filteredRequests}
        searchKey="destination"
        searchPlaceholder="Search by destination..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Trip Resources</DialogTitle>
            <DialogDescription>
              Select vehicle and driver assignments for transport to{" "}
              <span className="font-semibold text-foreground">
                {selectedRequest?.destination}
              </span>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle" className="text-right">
                Vehicle
              </Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select available vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {readyVehicles.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 text-center">
                      No vehicles ready
                    </div>
                  ) : (
                    readyVehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.plateNumber} ({v.make} {v.model}) - {v.status}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver" className="text-right">
                Driver
              </Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select active driver..." />
                </SelectTrigger>
                <SelectContent>
                  {activeDrivers.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 text-center">
                      No active drivers
                    </div>
                  ) : (
                    activeDrivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.phone})
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
            <Button onClick={handleConfirmAssign} disabled={!selectedVehicleId || !selectedDriverId}>
              Bind Resources & Start Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
