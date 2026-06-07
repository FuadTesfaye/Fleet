"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/shared/stats-card"
import { Fuel, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVehicleStore } from "@/store/vehicle.store"
import { useFuelStore } from "@/store/fuel.store"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const chartData = [
  { week: "W1", liters: 240, cost: 13500 },
  { week: "W2", liters: 320, cost: 18000 },
  { week: "W3", liters: 280, cost: 15700 },
  { week: "W4", liters: 410, cost: 23000 },
]

export default function FuelDashboardPage() {
  const vehicles = useVehicleStore((s) => s.vehicles)
  const fuelLogs = useFuelStore((s) => s.fuelLogs)

  const stats = React.useMemo(() => {
    const totalLiters = fuelLogs.reduce((acc, curr) => acc + curr.liters, 0)
    const totalCost = fuelLogs.reduce((acc, curr) => acc + curr.totalCost, 0)
    const lowFuelVehicles = vehicles.filter((v) => v.currentFuelLevel < 20).length

    return {
      totalLiters,
      totalCost,
      lowFuelVehicles,
      avgPrice: totalLiters > 0 ? (totalCost / totalLiters).toFixed(2) : "0.00",
    }
  }, [fuelLogs, vehicles])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel Tracking Dashboard"
        description="Monitor real-time fuel reserves, consumption trends, low fuel events, and refill expenditures."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Refills (Liters)"
          value={`${stats.totalLiters.toLocaleString()} L`}
          icon={Fuel}
        />
        <StatsCard
          title="Total Fuel Cost"
          value={`ETB ${stats.totalCost.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Average Cost / L"
          value={`ETB ${stats.avgPrice}`}
          icon={TrendingUp}
        />
        <StatsCard
          title="Low Fuel Warnings"
          value={stats.lowFuelVehicles}
          icon={AlertTriangle}
          description="Vehicles below 20%"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Fuel Consumption</CardTitle>
            <CardDescription>
              Analyze liters filled and total cost across active weeks this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" label={{ value: "Liters (L)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: "Cost (ETB)", angle: 90, position: "insideRight" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="liters" name="Volume (Liters)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="cost" name="Cost (ETB)" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Low Fuel Alert Log</CardTitle>
            <CardDescription>
              Vehicles requiring immediate dispatch of refuelling vouchers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[350px] overflow-y-auto">
            {vehicles.filter(v => v.currentFuelLevel < 25).length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 text-center">
                All vehicles have sufficient fuel.
              </div>
            ) : (
              vehicles
                .filter((v) => v.currentFuelLevel < 25)
                .map((vehicle) => (
                  <div key={vehicle.id} className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-sm">{vehicle.plateNumber}</div>
                      <div className="text-xs text-muted-foreground">{vehicle.make} {vehicle.model}</div>
                    </div>
                    <div className="text-right">
                      <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs px-2 py-0.5 rounded font-semibold">
                        {vehicle.currentFuelLevel}% Left
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">Capacity: {vehicle.fuelCapacity}L</div>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
