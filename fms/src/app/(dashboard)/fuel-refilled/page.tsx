"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useFuelStore } from "@/store/fuel.store"
import { useVehicleStore } from "@/store/vehicle.store"
import { FuelLog } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function FuelRefilledPage() {
  const logs = useFuelStore((s) => s.logs)
  const addLog = useFuelStore((s) => s.addLog)
  const vehicles = useVehicleStore((s) => s.vehicles)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    vehicleId: "",
    liters: 0,
    totalCost: 0,
    stationName: "",
    odometerReading: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.vehicleId || formData.liters <= 0 || formData.totalCost <= 0 || !formData.stationName || formData.odometerReading <= 0) {
      toast.error("Please fill in all fields correctly")
      return
    }

    addLog({
      ...formData,
      liters: Number(formData.liters),
      totalCost: Number(formData.totalCost),
      odometerReading: Number(formData.odometerReading),
      date: new Date(),
      status: "completed",
    })

    toast.success("Fuel refill receipt logged successfully")
    setOpen(false)
    setFormData({
      vehicleId: "",
      liters: 0,
      totalCost: 0,
      stationName: "",
      odometerReading: 0,
    })
  }

  const columns: ColumnDef<FuelLog>[] = [
    {
      accessorKey: "id",
      header: "Slip ID",
    },
    {
      accessorKey: "vehicleId",
      header: "Vehicle Plate",
      cell: ({ row }) => {
        const id = row.getValue("vehicleId") as string
        const vehicle = vehicles.find((v) => v.id === id)
        return <span className="font-semibold">{vehicle ? vehicle.plateNumber : "Unknown"}</span>
      },
    },
    {
      accessorKey: "date",
      header: "Date Refilled",
      cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
      accessorKey: "liters",
      header: "Volume (Liters)",
      cell: ({ row }) => <span>{row.getValue("liters")} L</span>,
    },
    {
      accessorKey: "totalCost",
      header: "Cost",
      cell: ({ row }) => <span>ETB {Number(row.getValue("totalCost")).toLocaleString()}</span>,
    },
    {
      accessorKey: "stationName",
      header: "Refuelling Station",
    },
    {
      accessorKey: "status",
      header: "Receipt Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel Refilled Registry"
        description="Verify refuelling receipts, gas station logs, and fuel voucher transactions."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Log Refill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Log Fuel Refill Slip</DialogTitle>
                  <DialogDescription>
                    Record details from the physical gas station voucher receipt.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vehicle" className="text-right">
                      Vehicle
                    </Label>
                    <Select
                      value={formData.vehicleId}
                      onValueChange={(val) => setFormData({ ...formData, vehicleId: val })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select vehicle..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.plateNumber} ({v.make})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="liters" className="text-right">
                      Liters (L)
                    </Label>
                    <Input
                      id="liters"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 50"
                      value={formData.liters || ""}
                      onChange={(e) => setFormData({ ...formData, liters: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Cost (ETB)
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 3500"
                      value={formData.totalCost || ""}
                      onChange={(e) => setFormData({ ...formData, totalCost: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="station" className="text-right">
                      Station
                    </Label>
                    <Input
                      id="station"
                      className="col-span-3"
                      placeholder="e.g. NOC Meskel Square"
                      value={formData.stationName}
                      onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="odo" className="text-right">
                      Odometer (KM)
                    </Label>
                    <Input
                      id="odo"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 124500"
                      value={formData.odometerReading || ""}
                      onChange={(e) => setFormData({ ...formData, odometerReading: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Log Voucher</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={logs}
        searchKey="stationName"
        searchPlaceholder="Search stations..."
      />
    </div>
  )
}
