"use client"

import { StatsCard } from "@/components/shared/stats-card"
import { useVehicles } from "@/hooks/use-vehicles"
import { useFuelStore } from "@/store/fuel.store"
import { useMaintenanceStore } from "@/store/maintenance.store"
import { Truck, AlertTriangle, Fuel, Wrench } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function KPIRow() {
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles()
  const fuelStore = useFuelStore()
  const workOrders = useMaintenanceStore((s) => s.workOrders)
  const activeWorkOrders = workOrders.filter(w => w.status === "in_progress")

  const activeVehicles = vehicles.filter((v) => v.status === "active").length
  const totalVehicles = vehicles.length
  
  const fuelCostThisMonth = fuelStore.totalCostThisMonth()
  const avgConsumption = fuelStore.avgConsumption()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoadingVehicles ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : (
        <StatsCard
          title="Active Fleet"
          value={`${activeVehicles} / ${totalVehicles}`}
          icon={Truck}
          description="Vehicles currently deployed or ready"
          trend={{ value: 4, isPositive: true }}
        />
      )}
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
