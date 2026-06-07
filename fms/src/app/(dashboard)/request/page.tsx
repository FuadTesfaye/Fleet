"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useRequestStore } from "@/store/request.store"
import { useAuthStore } from "@/store/auth.store"
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

export default function RequestPage() {
  const requests = useRequestStore((s) => s.requests)
  const addRequest = useRequestStore((s) => s.addRequest)
  const user = useAuthStore((s) => s.user)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    purpose: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    requestType: "pool" as "pool" | "field",
  })

  // Filter requests to only show the ones belonging to the logged in user
  const userRequests = React.useMemo(() => {
    if (!user) return []
    if (user.role === "super_admin" || user.role === "basic_service_manager") return requests
    return requests.filter((r) => r.requestedById === user.id)
  }, [requests, user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.purpose || !formData.destination || !formData.departureDate || !formData.returnDate) {
      toast.error("Please fill in all fields")
      return
    }

    addRequest({
      ...formData,
      requestedById: user.id,
      departureDate: new Date(formData.departureDate),
      returnDate: new Date(formData.returnDate),
    })

    toast.success("Transport request submitted successfully")
    setOpen(false)
    setFormData({
      purpose: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      requestType: "pool",
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Requests Console"
        description="Submit and monitor your vehicle slip and field trip transportation requests."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Request Transportation</DialogTitle>
                  <DialogDescription>
                    Fill in your project destination and travel window to request a pool vehicle.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purpose" className="text-right">
                      Purpose
                    </Label>
                    <Input
                      id="purpose"
                      className="col-span-3"
                      placeholder="e.g. Basin soil sampling"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="destination" className="text-right">
                      Destination
                    </Label>
                    <Input
                      id="destination"
                      className="col-span-3"
                      placeholder="e.g. Awash Basin"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={formData.requestType}
                      onValueChange={(val: any) => setFormData({ ...formData, requestType: val })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pool">Pool (Short Distance)</SelectItem>
                        <SelectItem value="field">Field (Long Distance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="departure" className="text-right">
                      Departure
                    </Label>
                    <Input
                      id="departure"
                      type="date"
                      className="col-span-3"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="return" className="text-right">
                      Return Date
                    </Label>
                    <Input
                      id="return"
                      type="date"
                      className="col-span-3"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={userRequests}
        searchKey="destination"
        searchPlaceholder="Search by destination..."
      />
    </div>
  )
}
