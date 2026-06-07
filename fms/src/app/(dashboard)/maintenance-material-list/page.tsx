"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useMaintenanceStore } from "@/store/maintenance.store"
import { SparePart } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
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
import { StatsCard } from "@/components/shared/stats-card"

export default function MaintenanceMaterialListPage() {
  const spareParts = useMaintenanceStore((s) => s.spareParts)
  const addSparePart = useMaintenanceStore((s) => s.addSparePart)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    partNumber: "",
    quantity: 0,
    unitCost: 0,
  })

  const stats = React.useMemo(() => {
    const uniqueItems = spareParts.length
    const totalQty = spareParts.reduce((acc, curr) => acc + curr.quantity, 0)
    const totalVal = spareParts.reduce((acc, curr) => acc + curr.quantity * curr.unitCost, 0)

    return {
      uniqueItems,
      totalQty,
      totalVal,
    }
  }, [spareParts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.partNumber || formData.quantity <= 0 || formData.unitCost <= 0) {
      toast.error("Please fill in all fields correctly")
      return
    }

    addSparePart({
      ...formData,
      quantity: Number(formData.quantity),
      unitCost: Number(formData.unitCost),
    })

    toast.success("Spare part registered to inventory")
    setOpen(false)
    setFormData({
      name: "",
      partNumber: "",
      quantity: 0,
      unitCost: 0,
    })
  }

  const columns: ColumnDef<SparePart>[] = [
    {
      accessorKey: "name",
      header: "Spare Part Name",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "partNumber",
      header: "Part Number",
      cell: ({ row }) => <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{row.getValue("partNumber")}</span>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity in Stock",
      cell: ({ row }) => {
        const qty = Number(row.getValue("quantity"))
        const color = qty < 5 ? "text-rose-600 font-semibold" : ""
        return <span className={color}>{qty} units</span>
      },
    },
    {
      accessorKey: "unitCost",
      header: "Unit Cost",
      cell: ({ row }) => <span>ETB {Number(row.getValue("unitCost")).toLocaleString()}</span>,
    },
    {
      id: "totalValue",
      header: "Total Stock Value",
      cell: ({ row }) => {
        const item = row.original
        const val = item.quantity * item.unitCost
        return <span className="font-medium text-foreground">ETB {val.toLocaleString()}</span>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Material Catalog Lookup"
        description="Browse certified spare parts, inspect stock quantities, and register incoming mechanical parts."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Spare Part
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Register Spare Part</DialogTitle>
                  <DialogDescription>
                    Add new mechanical components to the central inventory catalog.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Part Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="e.g. Heavy Duty Brake Pads"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="number" className="text-right font-medium text-xs">
                      Part Number
                    </Label>
                    <Input
                      id="number"
                      className="col-span-3"
                      placeholder="e.g. SP-BRK-9902"
                      value={formData.partNumber}
                      onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="qty" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="qty"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 10"
                      value={formData.quantity || ""}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Unit Cost (ETB)
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 1200"
                      value={formData.unitCost || ""}
                      onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add to Inventory</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Unique Inventory Items" value={stats.uniqueItems} icon={Package} />
        <StatsCard title="Total Units in Stock" value={stats.totalQty} icon={Package} />
        <StatsCard title="Total Inventory Value" value={`ETB ${stats.totalVal.toLocaleString()}`} icon={Package} />
      </div>

      <DataTable
        columns={columns}
        data={spareParts}
        searchKey="name"
        searchPlaceholder="Search spare parts..."
      />
    </div>
  )
}
