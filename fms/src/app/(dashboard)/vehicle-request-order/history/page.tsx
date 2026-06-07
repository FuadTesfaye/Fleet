"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "../columns"
import { useRequestStore } from "@/store/request.store"

export default function RequestHistoryPage() {
  const requests = useRequestStore((s) => s.requests)

  const historyRequests = React.useMemo(() => {
    // Show request orders that have been processed/decided
    return requests.filter((r) => r.status !== "pending")
  }, [requests])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request History"
        description="View records of historical, completed, and closed transport request orders."
      />

      <DataTable
        columns={columns}
        data={historyRequests}
        searchKey="destination"
        searchPlaceholder="Search by destination..."
      />
    </div>
  )
}
