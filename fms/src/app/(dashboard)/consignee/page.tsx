"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useFreightStore } from "@/store/freight.store"
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
import { toast } from "sonner"
import { Consignee } from "@/types"

export default function ConsigneePage() {
  const consignees = useFreightStore((s) => s.consignees)
  const addConsignee = useFreightStore((s) => s.addConsignee)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    contactName: "",
    phone: "",
    address: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.code || !formData.contactName || !formData.phone || !formData.address) {
      toast.error("Please fill in all fields")
      return
    }

    addConsignee(formData)
    toast.success("Consignee registered successfully")
    setOpen(false)
    setFormData({
      name: "",
      code: "",
      contactName: "",
      phone: "",
      address: "",
    })
  }

  const columns: ColumnDef<Consignee>[] = [
    {
      accessorKey: "name",
      header: "Consignee Entity Name",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "code",
      header: "Code Prefix",
      cell: ({ row }) => <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "contactName",
      header: "Contact Agent",
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      accessorKey: "address",
      header: "Delivery Address",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consignees Directory"
        description="Register and manage destination cargo consignees, grain depots, and regional distribution stations."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Consignee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Register Consignee Entity</DialogTitle>
                  <DialogDescription>
                    Add business receiving client profiles for freight manifest checkouts.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Entity Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="e.g. Hawassa Coffee Cooperative"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Code Prefix
                    </Label>
                    <Input
                      id="code"
                      className="col-span-3"
                      placeholder="e.g. HCC"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="agent" className="text-right">
                      Contact Agent
                    </Label>
                    <Input
                      id="agent"
                      className="col-span-3"
                      placeholder="e.g. Muluken Dessie"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      className="col-span-3"
                      placeholder="e.g. +251915223344"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Office Address
                    </Label>
                    <Input
                      id="address"
                      className="col-span-3"
                      placeholder="e.g. Hawassa Hub"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Register Entity</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={consignees}
        searchKey="name"
        searchPlaceholder="Search consignees..."
      />
    </div>
  )
}
