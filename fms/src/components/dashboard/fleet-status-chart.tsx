"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useVehicleStore } from "@/store/vehicle.store"

export function FleetStatusChart() {
  const vehicles = useVehicleStore((s) => s.vehicles)

  const data = [
    { name: "Active", value: vehicles.filter((v) => v.status === "active").length, fill: "var(--color-active)" },
    { name: "Maintenance", value: vehicles.filter((v) => v.status === "maintenance").length, fill: "var(--color-maintenance)" },
    { name: "Idle", value: vehicles.filter((v) => v.status === "idle").length, fill: "var(--color-idle)" },
    { name: "Out of Service", value: vehicles.filter((v) => v.status === "out_of_service").length, fill: "var(--color-out_of_service)" },
  ]

  const config = {
    active: { label: "Active", color: "hsl(var(--chart-3))" }, // Greenish
    maintenance: { label: "Maintenance", color: "hsl(var(--chart-1))" }, // Amber
    idle: { label: "Idle", color: "hsl(var(--muted-foreground))" },
    out_of_service: { label: "Out of Service", color: "hsl(var(--chart-4))" }, // Red
  } satisfies ChartConfig

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Fleet Status</CardTitle>
        <CardDescription>Current deployment state</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded shadow-md p-2 text-sm">
                        <p className="font-semibold">{payload[0].name}</p>
                        <p>{payload[0].value} vehicles</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
              {d.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
