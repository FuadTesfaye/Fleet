"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useDivisionStore } from "@/store/division.store"
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

export default function DivisionPage() {
  const divisions = useDivisionStore((s) => s.divisions)
  const addDivision = useDivisionStore((s) => s.addDivision)

  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      toast.error("Please fill in all fields")
      return
    }

    addDivision(formData)
    toast.success("New division added successfully")
    setOpen(false)
    setFormData({
      name: "",
      code: "",
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Division Management"
        description="Configure ministry departments, divisions, and sub-sectors for fleet resource grouping."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Division
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Administrative Division</DialogTitle>
                  <DialogDescription>
                    Create a new organizational department to allocate transport resources.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="e.g. Finance & Operations Division"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Code
                    </Label>
                    <Input
                      id="code"
                      className="col-span-3"
                      placeholder="e.g. FOD"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Division</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={divisions}
        searchKey="name"
        searchPlaceholder="Search by division name..."
      />
    </div>
  )
}
