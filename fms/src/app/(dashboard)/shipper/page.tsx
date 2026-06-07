"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useFreightStore } from "@/store/freight.store"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
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
import { Shipper } from "@/types"

export default function ShipperPage() {
  const shippers = useFreightStore((s) => s.shippers)
  const addShipper = useFreightStore((s) => s.addShipper)

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

    addShipper(formData)
    toast.success("Shipper registered successfully")
    setOpen(false)
    setFormData({
      name: "",
      code: "",
      contactName: "",
      phone: "",
      address: "",
    })
  }

  const columns: ColumnDef<Shipper>[] = [
    {
      accessorKey: "name",
      header: "Shipper Entity Name",
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
      header: "Billing/Office Address",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shippers Directory"
        description="Register and manage contract shipping entities and bulk cargo consignors."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Shipper
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Register Shipper Entity</DialogTitle>
                  <DialogDescription>
                    Add business shipping client profiles for logistics invoicing.
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
                      placeholder="e.g. Ethiopian Seed Corp"
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
                      placeholder="e.g. ESC"
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
                      placeholder="e.g. Bekele Zewdu"
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
                      placeholder="e.g. +251911334455"
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
                      placeholder="e.g. Gotera, Addis Ababa"
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
        data={shippers}
        searchKey="name"
        searchPlaceholder="Search shippers..."
      />
    </div>
  )
}
