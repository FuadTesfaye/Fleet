"use client"

import { PageHeader } from "@/components/layout/page-header"
import { KPIRow } from "@/components/dashboard/kpi-row"
import { FleetStatusChart } from "@/components/dashboard/fleet-status-chart"
import { FuelTrendChart } from "@/components/dashboard/fuel-trend-chart"
import { RecentRequests } from "@/components/dashboard/recent-requests"
import { useAuthStore } from "@/store/auth.store"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Welcome back, ${user?.name.split(" ")[0] || "User"}`} 
        description="Here is your fleet overview for today."
        action={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        }
      />

      <KPIRow />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FleetStatusChart />
        <FuelTrendChart />
        <RecentRequests />
      </div>
    </div>
  )
}
