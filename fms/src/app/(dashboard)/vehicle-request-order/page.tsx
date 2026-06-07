"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useRequestStore } from "@/store/request.store"
import { StatsCard } from "@/components/shared/stats-card"
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react"

export default function VehicleRequestOrderPage() {
  const requests = useRequestStore((s) => s.requests)

  const stats = React.useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved" || r.status === "in_progress" || r.status === "completed").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }
  }, [requests])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Request Orders"
        description="Monitor and register official transport requests and dispatch slips."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          icon={FileText}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pending}
          icon={Clock}
          description="Awaiting review"
        />
        <StatsCard
          title="Approved Slips"
          value={stats.approved}
          icon={CheckCircle2}
          description="Cleared for transport"
        />
        <StatsCard
          title="Declined Requests"
          value={stats.rejected}
          icon={XCircle}
        />
      </div>

      <DataTable
        columns={columns}
        data={requests}
        searchKey="destination"
        searchPlaceholder="Search by destination..."
      />
    </div>
  )
}
