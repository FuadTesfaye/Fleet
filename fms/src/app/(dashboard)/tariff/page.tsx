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
import { Tariff } from "@/types"

export default function TariffPage() {
  const tariffs = useFreightStore((s) => s.tariffs)
  const addTariff = useFreightStore((s) => s.addTariff)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    routeFrom: "",
    routeTo: "",
    ratePerTonKm: 0,
    baseTariff: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.routeFrom || !formData.routeTo || formData.ratePerTonKm <= 0 || formData.baseTariff <= 0) {
      toast.error("Please fill in all fields correctly")
      return
    }

    addTariff(formData)
    toast.success("Billing tariff corridor added successfully")
    setOpen(false)
    setFormData({
      routeFrom: "",
      routeTo: "",
      ratePerTonKm: 0,
      baseTariff: 0,
    })
  }

  const columns: ColumnDef<Tariff>[] = [
    {
      accessorKey: "routeFrom",
      header: "Origin Corridor Node",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("routeFrom")}</div>,
    },
    {
      accessorKey: "routeTo",
      header: "Destination Corridor Node",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("routeTo")}</div>,
    },
    {
      accessorKey: "ratePerTonKm",
      header: "Rate per Ton-KM",
      cell: ({ row }) => <span>ETB {row.getValue("ratePerTonKm")}</span>,
    },
    {
      accessorKey: "baseTariff",
      header: "Base Transit Tariff",
      cell: ({ row }) => <span>ETB {Number(row.getValue("baseTariff")).toLocaleString()}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Freight Tariff Matrix"
        description="Configure pricing policies, transit rate per kilometer, and regional haulage fees."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Tariff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Pricing Tariff Corridor</DialogTitle>
                  <DialogDescription>
                    Define starting nodes, end nodes, and billing coefficients.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="from" className="text-right">
                      Origin Node
                    </Label>
                    <Input
                      id="from"
                      className="col-span-3"
                      placeholder="e.g. Addis Ababa"
                      value={formData.routeFrom}
                      onChange={(e) => setFormData({ ...formData, routeFrom: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="to" className="text-right">
                      Destination
                    </Label>
                    <Input
                      id="to"
                      className="col-span-3"
                      placeholder="e.g. Gode"
                      value={formData.routeTo}
                      onChange={(e) => setFormData({ ...formData, routeTo: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rate" className="text-right font-medium text-xs">
                      Rate / Ton-KM
                    </Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.1"
                      className="col-span-3"
                      placeholder="e.g. 4.5"
                      value={formData.ratePerTonKm || ""}
                      onChange={(e) => setFormData({ ...formData, ratePerTonKm: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="base" className="text-right">
                      Base Tariff (ETB)
                    </Label>
                    <Input
                      id="base"
                      type="number"
                      className="col-span-3"
                      placeholder="e.g. 15000"
                      value={formData.baseTariff || ""}
                      onChange={(e) => setFormData({ ...formData, baseTariff: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Corridor Policy</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={tariffs}
        searchKey="routeFrom"
        searchPlaceholder="Search origins..."
      />
    </div>
  )
}
