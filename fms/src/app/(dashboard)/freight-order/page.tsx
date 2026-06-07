"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { getColumns } from "./columns"
import { useFreightStore } from "@/store/freight.store"
import { useVehicleStore } from "@/store/vehicle.store"
import { FreightOrder } from "@/types"
import { StatsCard } from "@/components/shared/stats-card"
import { FileText, Clock, Truck, CheckCircle, Plus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function FreightOrderPage() {
  const freightOrders = useFreightStore((s) => s.freightOrders)
  const shippers = useFreightStore((s) => s.shippers)
  const consignees = useFreightStore((s) => s.consignees)
  const commodities = useFreightStore((s) => s.commodities)

  const addFreightOrder = useFreightStore((s) => s.addFreightOrder)
  const assignFreightVehicle = useFreightStore((s) => s.assignFreightVehicle)
  const updateStatus = useFreightStore((s) => s.updateFreightOrderStatus)

  const vehicles = useVehicleStore((s) => s.vehicles)
  const readyVehicles = vehicles.filter((v) => v.status === "active" || v.status === "idle")

  const [selectedOrder, setSelectedOrder] = React.useState<FreightOrder | null>(null)
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)

  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string>("")
  const [formData, setFormData] = React.useState({
    shipperId: "",
    consigneeId: "",
    commodityId: "",
    weightTons: 0,
    volumeCbm: 0,
    origin: "",
    destination: "",
    freightCost: 0,
  })

  const stats = React.useMemo(() => {
    return {
      total: freightOrders.length,
      pending: freightOrders.filter((fo) => fo.status === "pending").length,
      dispatched: freightOrders.filter((fo) => fo.status === "dispatched").length,
      delivered: freightOrders.filter((fo) => fo.status === "delivered").length,
    }
  }, [freightOrders])

  const handleOpenAssign = (order: FreightOrder) => {
    setSelectedOrder(order)
    setSelectedVehicleId("")
    setAssignOpen(true)
  }

  const handleConfirmAssign = () => {
    if (!selectedOrder || !selectedVehicleId) return
    assignFreightVehicle(selectedOrder.id, selectedVehicleId)
    toast.success(`Vehicle assigned to freight order ${selectedOrder.orderNumber}`)
    setAssignOpen(false)
    setSelectedOrder(null)
  }

  const handleConfirmComplete = (order: FreightOrder) => {
    updateStatus(order.id, "delivered")
    toast.success(`Freight order ${order.orderNumber} marked as delivered`)
  }

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.shipperId || !formData.consigneeId || !formData.commodityId || !formData.origin || !formData.destination) {
      toast.error("Please fill in all fields")
      return
    }

    addFreightOrder({
      ...formData,
      weightTons: Number(formData.weightTons),
      volumeCbm: Number(formData.volumeCbm),
      freightCost: Number(formData.freightCost),
    })

    toast.success("New freight order registered successfully")
    setCreateOpen(false)
    setFormData({
      shipperId: "",
      consigneeId: "",
      commodityId: "",
      weightTons: 0,
      volumeCbm: 0,
      origin: "",
      destination: "",
      freightCost: 0,
    })
  }

  const columns = getColumns({
    onAssign: handleOpenAssign,
    onComplete: handleConfirmComplete,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Freight Orders"
        description="Register cargo contracts, track cargo delivery progress, and allocate heavy freight trailers."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Freight Order
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Cargo Orders" value={stats.total} icon={FileText} />
        <StatsCard title="Pending Logistics" value={stats.pending} icon={Clock} />
        <StatsCard title="Dispatched Trucks" value={stats.dispatched} icon={Truck} />
        <StatsCard title="Delivered Cargo" value={stats.delivered} icon={CheckCircle} />
      </div>

      <DataTable
        columns={columns}
        data={freightOrders}
        searchKey="orderNumber"
        searchPlaceholder="Search by order number..."
      />

      {/* Assign Truck Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Assign Freight Vehicle</DialogTitle>
            <DialogDescription>
              Pair a transport truck with freight order{" "}
              <span className="font-semibold text-foreground">{selectedOrder?.orderNumber}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle" className="text-right">
                Vehicle
              </Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select trailer..." />
                </SelectTrigger>
                <SelectContent>
                  {readyVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.plateNumber} ({v.make} {v.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={!selectedVehicleId}>
              Confirm Dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Freight Order Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreateOrder}>
            <DialogHeader>
              <DialogTitle>Register Freight Order</DialogTitle>
              <DialogDescription>
                Register a new cargo haulage contract from a certified shipper to a consignee.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Shipper</Label>
                  <Select
                    value={formData.shipperId}
                    onValueChange={(val) => setFormData({ ...formData, shipperId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Shipper" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippers.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Consignee</Label>
                  <Select
                    value={formData.consigneeId}
                    onValueChange={(val) => setFormData({ ...formData, consigneeId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {consignees.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Commodity Type</Label>
                  <Select
                    value={formData.commodityId}
                    onValueChange={(val) => setFormData({ ...formData, commodityId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contract Price (ETB)</Label>
                  <Input
                    type="number"
                    value={formData.freightCost || ""}
                    onChange={(e) => setFormData({ ...formData, freightCost: Number(e.target.value) })}
                    placeholder="e.g. 24000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (Tons)</Label>
                  <Input
                    type="number"
                    value={formData.weightTons || ""}
                    onChange={(e) => setFormData({ ...formData, weightTons: Number(e.target.value) })}
                    placeholder="e.g. 25"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Volume (CBM)</Label>
                  <Input
                    type="number"
                    value={formData.volumeCbm || ""}
                    onChange={(e) => setFormData({ ...formData, volumeCbm: Number(e.target.value) })}
                    placeholder="e.g. 45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Origin Node</Label>
                  <Input
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Adama Depot"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destination Station</Label>
                  <Input
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Hawassa Hub"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Register Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
