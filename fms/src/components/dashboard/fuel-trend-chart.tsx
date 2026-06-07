"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useFuelStore } from "@/store/fuel.store"
import { format, subMonths } from "date-fns"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function FuelTrendChart() {
  const fuelLogs = useFuelStore((s) => s.fuelLogs)

  // Generate last 6 months data
  const data = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), 5 - i)
    const monthKey = format(date, "MMM")
    
    const logsInMonth = fuelLogs.filter(log => {
      const logDate = new Date(log.date)
      return logDate.getMonth() === date.getMonth() && logDate.getFullYear() === date.getFullYear()
    })

    return {
      month: monthKey,
      cost: logsInMonth.reduce((sum, log) => sum + log.totalCost, 0),
      liters: logsInMonth.reduce((sum, log) => sum + log.liters, 0),
    }
  })

  const config = {
    cost: { label: "Cost (ETB)", color: "hsl(var(--chart-1))" },
    liters: { label: "Liters", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Fuel Consumption Trend</CardTitle>
        <CardDescription>6-month analysis of fuel usage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                yAxisId="left" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value / 1000}k`} 
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded shadow-md p-2 text-sm">
                        <p className="font-semibold mb-1">{label}</p>
                        <p className="text-[var(--color-cost)] font-medium">Cost: ETB {payload[0].value?.toLocaleString()}</p>
                        <p className="text-[var(--color-liters)] font-medium">Volume: {payload[1].value} L</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar yAxisId="left" dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
