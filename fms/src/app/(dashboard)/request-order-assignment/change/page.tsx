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

export default function AssignmentChangePage() {
  const requests = useRequestStore((s) => s.requests)
  const assignVehicleAndDriver = useRequestStore((s) => s.assignVehicleAndDriver)

  const vehicles = useVehicleStore((s) => s.vehicles)
  const drivers = useDriverStore((s) => s.drivers)

  const [selectedRequest, setSelectedRequest] = React.useState<TransportRequest | null>(null)
  const [open, setOpen] = React.useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string>("")
  const [selectedDriverId, setSelectedDriverId] = React.useState<string>("")

  const readyVehicles = vehicles.filter((v) => v.status === "active" || v.status === "idle")
  const activeDrivers = drivers.filter((d) => d.isActive)

  const handleOpenChange = (request: TransportRequest) => {
    setSelectedRequest(request)
    setSelectedVehicleId(request.assignedVehicleId || "")
    setSelectedDriverId(request.assignedDriverId || "")
    setOpen(true)
  }

  const handleConfirmChange = () => {
    if (!selectedRequest || !selectedVehicleId || !selectedDriverId) {
      toast.error("Please select both a vehicle and a driver")
      return
    }

    // Assign the new vehicle and driver
    assignVehicleAndDriver(selectedRequest.id, selectedVehicleId, selectedDriverId)
    toast.success("Request assignments successfully updated")
    setOpen(false)
    setSelectedRequest(null)
  }

  const columns = getColumns({
    onChange: handleOpenChange,
  })

  // Filter requests that are currently assigned
  const assignedRequests = React.useMemo(() => {
    return requests.filter((r) => !!r.assignedVehicleId && (r.status === "in_progress" || r.status === "approved"))
  }, [requests])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignment Change"
        description="Reallocate or swap vehicle/driver resources for scheduled and active transport requests."
      />

      <DataTable
        columns={columns}
        data={assignedRequests}
        searchKey="destination"
        searchPlaceholder="Search by destination..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Re-assign Trip Resources</DialogTitle>
            <DialogDescription>
              Swap the current vehicle or driver for transport to{" "}
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
                  <SelectValue placeholder="Select vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {readyVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.plateNumber} ({v.make} {v.model}) - {v.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver" className="text-right">
                Driver
              </Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select driver..." />
                </SelectTrigger>
                <SelectContent>
                  {activeDrivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.phone})
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
            <Button onClick={handleConfirmChange}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
