"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Route } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
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
import { toast } from "sonner"

interface GeoRouteItem {
  id: string
  name: string
  startLocation: string
  endLocation: string
  distanceKm: number
  allowedDeviationMeters: number
  isActive: boolean
}

const mockRoutes: GeoRouteItem[] = [
  { id: "rt-001", name: "Addis Ababa - Adama Express Corridor", startLocation: "Addis Ababa HQ", endLocation: "Adama Node", distanceKm: 85, allowedDeviationMeters: 500, isActive: true },
  { id: "rt-002", name: "Addis Ababa - Hawassa Basin Route", startLocation: "Addis Ababa HQ", endLocation: "Hawassa Station", distanceKm: 275, allowedDeviationMeters: 1000, isActive: true },
  { id: "rt-003", name: "Adama - Gode Lowlands Pipeline Corridor", startLocation: "Adama Node", endLocation: "Gode Office", distanceKm: 650, allowedDeviationMeters: 2000, isActive: false },
]

export default function GeoroutePage() {
  const [routes, setRoutes] = React.useState<GeoRouteItem[]>(mockRoutes)
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    startLocation: "",
    endLocation: "",
    distanceKm: 0,
    allowedDeviationMeters: 500,
  })

  const handleDelete = (id: string) => {
    setRoutes(routes.filter((r) => r.id !== id))
    toast.success("Route deleted successfully")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.startLocation || !formData.endLocation || formData.distanceKm <= 0) {
      toast.error("Please fill in all fields correctly")
      return
    }

    const newRoute: GeoRouteItem = {
      id: `rt-${Date.now()}`,
      ...formData,
      isActive: true,
    }

    setRoutes([newRoute, ...routes])
    toast.success("New corridor route registered successfully")
    setOpen(false)
    setFormData({
      name: "",
      startLocation: "",
      endLocation: "",
      distanceKm: 0,
      allowedDeviationMeters: 500,
    })
  }

  const columns: ColumnDef<GeoRouteItem>[] = [
    {
      accessorKey: "name",
      header: "Route Corridor Name",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "startLocation",
      header: "Start Node",
    },
    {
      accessorKey: "endLocation",
      header: "End Node",
    },
    {
      accessorKey: "distanceKm",
      header: "Distance",
      cell: ({ row }) => <span>{row.getValue("distanceKm")} km</span>,
    },
    {
      accessorKey: "allowedDeviationMeters",
      header: "Allowed Deviation",
      cell: ({ row }) => <span>{row.getValue("allowedDeviationMeters")} m</span>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("isActive") as boolean
        return <StatusBadge status={active ? "active" : "out_of_service"} />
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original
        return (
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geo Routes"
        description="Configure specific geographical corridors, stops, and allowed routing deviation rules."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Route
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Register Route Corridor</DialogTitle>
                  <DialogDescription>
                    Define starting nodes, end nodes, and distance estimates.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Corridor Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="e.g. Addis - Adama Express"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start" className="text-right">
                      Start Node
                    </Label>
                    <Input
                      id="start"
                      className="col-span-3"
                      placeholder="e.g. Addis Ababa HQ"
                      value={formData.startLocation}
                      onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end" className="text-right">
                      End Node
                    </Label>
                    <Input
                      id="end"
                      className="col-span-3"
                      placeholder="e.g. Adama Node"
                      value={formData.endLocation}
                      onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dist" className="text-right">
                      Distance (km)
                    </Label>
                    <Input
                      id="dist"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 85"
                      value={formData.distanceKm || ""}
                      onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dev" className="text-right">
                      Max Deviation (m)
                    </Label>
                    <Input
                      id="dev"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 500"
                      value={formData.allowedDeviationMeters || ""}
                      onChange={(e) => setFormData({ ...formData, allowedDeviationMeters: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Route</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={routes}
        searchKey="name"
        searchPlaceholder="Search by route name..."
      />
    </div>
  )
}
