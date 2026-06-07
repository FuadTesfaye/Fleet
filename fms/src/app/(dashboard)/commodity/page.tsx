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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Commodity } from "@/types"

export default function CommodityPage() {
  const commodities = useFreightStore((s) => s.commodities)
  const addCommodity = useFreightStore((s) => s.addCommodity)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    category: "general" as Commodity["category"],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      toast.error("Please fill in all fields")
      return
    }

    addCommodity(formData)
    toast.success("Commodity type registered successfully")
    setOpen(false)
    setFormData({
      name: "",
      code: "",
      category: "general",
    })
  }

  const columns: ColumnDef<Commodity>[] = [
    {
      accessorKey: "name",
      header: "Commodity Description",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "code",
      header: "Classification Code",
      cell: ({ row }) => <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "category",
      header: "Logistical Class",
      cell: ({ row }) => <span className="capitalize">{row.getValue("category")}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commodity Directory"
        description="Configure cargo classifications, packaging specs, and hazmat categories."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Cargo Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Register Commodity Type</DialogTitle>
                  <DialogDescription>
                    Define cargo class specifications for shipping manifests.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Cargo Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="e.g. Urea Fertilizer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Class Code
                    </Label>
                    <Input
                      id="code"
                      className="col-span-3"
                      placeholder="e.g. FERT-UREA"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cat" className="text-right">
                      Logistics Class
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agricultural">Agricultural Products</SelectItem>
                        <SelectItem value="fertilizer">Fertilizers & Soil Inputs</SelectItem>
                        <SelectItem value="construction">Construction Materials</SelectItem>
                        <SelectItem value="machinery">Heavy Machinery / Assets</SelectItem>
                        <SelectItem value="general">General Cargo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Commodity</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={commodities}
        searchKey="name"
        searchPlaceholder="Search cargo descriptions..."
      />
    </div>
  )
}
