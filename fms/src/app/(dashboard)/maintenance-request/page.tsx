"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { getColumns } from "./columns"
import { useMaintenanceStore } from "@/store/maintenance.store"
import { useVehicleStore } from "@/store/vehicle.store"
import { MaintenanceRequest } from "@/types"
import { StatsCard } from "@/components/shared/stats-card"
import { ClipboardList, Clock, Wrench, CheckCircle, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function MaintenanceRequestPage() {
  const requests = useMaintenanceStore((s) => s.maintenanceRequests)
  const addRequest = useMaintenanceStore((s) => s.addRequest)
  const approveRequest = useMaintenanceStore((s) => s.approveRequest)
  const rejectRequest = useMaintenanceStore((s) => s.rejectRequest)

  const vehicles = useVehicleStore((s) => s.vehicles)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    vehicleId: "",
    description: "",
    urgency: "medium" as MaintenanceRequest["urgency"],
  })

  const stats = React.useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      completed: requests.filter((r) => r.status === "completed").length,
    }
  }, [requests])

  const handleApprove = (req: MaintenanceRequest) => {
    approveRequest(req.id)
    toast.success(`Request ${req.id} approved for work order creation`)
  }

  const handleReject = (req: MaintenanceRequest) => {
    rejectRequest(req.id)
    toast.success(`Request ${req.id} rejected`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.vehicleId || !formData.description) {
      toast.error("Please fill in all fields correctly")
      return
    }

    addRequest({
      vehicleId: formData.vehicleId,
      driverId: "user-1",
      requestDate: new Date(),
      issueDescription: formData.description,
      urgency: formData.urgency,
    })

    toast.success("Maintenance request submitted successfully")
    setOpen(false)
    setFormData({
      vehicleId: "",
      description: "",
      urgency: "medium",
    })
  }

  const columns = getColumns({
    onApprove: handleApprove,
    onReject: handleReject,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Request Slips"
        description="Submit repair requests, inspect fault descriptions, and monitor scheduled vehicle maintenance cycles."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Submit Maintenance Request</DialogTitle>
                  <DialogDescription>
                    Provide fault descriptions and urgency for vehicle inspection.
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
                    <Label htmlFor="desc" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="desc"
                      className="col-span-3"
                      placeholder="e.g. Brake grinding sound"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="urgency" className="text-right">
                      Urgency
                    </Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(val: any) => setFormData({ ...formData, urgency: val })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="critical">Critical Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Slip</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Slips" value={stats.total} icon={ClipboardList} />
        <StatsCard title="Awaiting Inspection" value={stats.pending} icon={Clock} />
        <StatsCard title="Undergoing Repairs" value={stats.inProgress} icon={Wrench} />
        <StatsCard title="Resolved Issues" value={stats.completed} icon={CheckCircle} />
      </div>

      <DataTable
        columns={columns}
        data={requests}
        searchKey="issueDescription"
        searchPlaceholder="Search issue description..."
      />
    </div>
  )
}
