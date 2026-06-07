"use client"

import { StatsCard } from "@/components/shared/stats-card"
import { useVehicleStore } from "@/store/vehicle.store"
import { useFuelStore } from "@/store/fuel.store"
import { useMaintenanceStore } from "@/store/maintenance.store"
import { Truck, AlertTriangle, Fuel, Wrench } from "lucide-react"

export function KPIRow() {
  const vehicles = useVehicleStore((s) => s.vehicles)
  const fuelStore = useFuelStore()
  const workOrders = useMaintenanceStore((s) => s.workOrders)
  const activeWorkOrders = workOrders.filter(w => w.status === "in_progress")

  const activeVehicles = vehicles.filter((v) => v.status === "active").length
  const totalVehicles = vehicles.length
  
  const fuelCostThisMonth = fuelStore.totalCostThisMonth()
  const avgConsumption = fuelStore.avgConsumption()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Active Fleet"
        value={`${activeVehicles} / ${totalVehicles}`}
        icon={Truck}
        description="Vehicles currently deployed or ready"
        trend={{ value: 4, isPositive: true }}
      />
      <StatsCard
        title="Fuel Cost (This Month)"
        value={`ETB ${fuelCostThisMonth.toLocaleString()}`}
        icon={Fuel}
        description="Total approved fuel expenses"
      />
      <StatsCard
        title="Avg. Consumption"
        value={`${avgConsumption.toFixed(1)} L/100km`}
        icon={AlertTriangle}
        description="Fleet average efficiency"
        trend={{ value: 2.1, isPositive: false }}
      />
      <StatsCard
        title="Active Maintenance"
        value={activeWorkOrders.length}
        icon={Wrench}
        description="Vehicles currently in shop"
      />
    </div>
  )
}
