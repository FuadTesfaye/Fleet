"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { getColumns } from "./columns"
import { mockGeofences } from "@/lib/mock-data"
import { useVehicleStore } from "@/store/vehicle.store"
import { Geofence } from "@/types"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function GeofencePage() {
  const [geofences, setGeofences] = React.useState<Geofence[]>(mockGeofences)
  const vehicles = useVehicleStore((s) => s.vehicles)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    vehicleIds: [] as string[],
  })

  const handleDelete = (id: string) => {
    setGeofences(geofences.filter((g) => g.id !== id))
    toast.success("Geofence deleted successfully")
  }

  const handleVehicleToggle = (vehicleId: string) => {
    setFormData((prev) => {
      const selected = prev.vehicleIds.includes(vehicleId)
        ? prev.vehicleIds.filter((id) => id !== vehicleId)
        : [...prev.vehicleIds, vehicleId]
      return { ...prev, vehicleIds: selected }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all fields")
      return
    }

    const newGeofence: Geofence = {
      id: `geo-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      vehicleIds: formData.vehicleIds,
      isActive: true,
      boundaries: [],
      createdAt: new Date(),
    }

    setGeofences([newGeofence, ...geofences])
    toast.success("New geofence zone registered successfully")
    setOpen(false)
    setFormData({
      name: "",
      description: "",
      vehicleIds: [],
    })
  }

  const columns = getColumns({ onDelete: handleDelete })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geo Fences"
        description="Define virtual geographical boundaries and alert rules for vehicle movements."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Geofence
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Register Geofence Zone</DialogTitle>
                  <DialogDescription>
                    Define a boundary and select vehicles to monitor.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Zone Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="e.g. Addis Headquarters"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="desc" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="desc"
                      className="col-span-3"
                      placeholder="e.g. Radius around central depot"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-start">
                    <Label className="text-right mt-1">Assign Fleet</Label>
                    <div className="col-span-3 max-h-[150px] overflow-y-auto border p-2 rounded space-y-2">
                      {vehicles.map((v) => (
                        <div key={v.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`veh-${v.id}`}
                            checked={formData.vehicleIds.includes(v.id)}
                            onCheckedChange={() => handleVehicleToggle(v.id)}
                          />
                          <Label htmlFor={`veh-${v.id}`} className="text-xs font-medium cursor-pointer">
                            {v.plateNumber} ({v.make})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Zone</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={geofences}
        searchKey="name"
        searchPlaceholder="Search by geofence name..."
      />
    </div>
  )
}
