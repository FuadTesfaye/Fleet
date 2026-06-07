"use client"

import { PageHeader } from "@/components/layout/page-header"
import { useTripStore } from "@/store/trip.store"
import { useVehicleStore } from "@/store/vehicle.store"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

export default function TrackingPage() {
  const trips = useTripStore((s) => s.trips)
  const activeTrips = trips.filter((t) => t.status === "active")
  const getVehicle = useVehicleStore((s) => s.getById)

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader 
        title="Live Tracking" 
        description="Real-time map view of active fleet vehicles."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Sidebar List */}
        <div className="col-span-1 border rounded-lg bg-card flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-muted/50 font-semibold flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Active Trips ({activeTrips.length})
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTrips.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-4">No active trips</p>
            ) : (
              activeTrips.map(trip => {
                const vehicle = getVehicle(trip.vehicleId)
                return (
                  <Card key={trip.id} className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm">{vehicle?.plateNumber}</span>
                        <span className="text-xs text-emerald-500 font-medium">Moving</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="truncate">{trip.startLocation}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="truncate">{trip.endLocation}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Mock Map Area */}
        <div className="col-span-1 lg:col-span-3 border rounded-lg bg-slate-100 dark:bg-slate-800/50 relative overflow-hidden flex items-center justify-center">
          {/* Decorative grid pattern for mock map */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>
          
          <div className="text-center z-10 p-6 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm max-w-sm">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Map Integration Pending</h3>
            <p className="text-sm text-muted-foreground">
              GPS telemetry data is being simulated. Production map integration (e.g., Google Maps / Mapbox) will be embedded here.
            </p>
          </div>

          {/* Random mock markers */}
          {activeTrips.map((trip, i) => (
            <div 
              key={trip.id}
              className="absolute animate-pulse"
              style={{
                top: `${20 + (i * 15) % 60}%`,
                left: `${20 + (i * 25) % 60}%`,
              }}
            >
              <MapPin className="w-6 h-6 text-primary drop-shadow-md" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-background border text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                {getVehicle(trip.vehicleId)?.plateNumber}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
