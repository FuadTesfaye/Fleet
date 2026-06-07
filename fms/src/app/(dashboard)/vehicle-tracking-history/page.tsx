"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { useVehicleStore } from "@/store/vehicle.store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Clock, ShieldAlert } from "lucide-react"

interface TelemetryPoint {
  time: string
  address: string
  speed: number
  fuel: number
  event?: string
}

const mockHistoryLogs: Record<string, TelemetryPoint[]> = {
  "veh-001": [
    { time: "10:00 AM", address: "Addis Ababa HQ (Arat Kilo)", speed: 0, fuel: 85, event: "Trip Started" },
    { time: "10:20 AM", address: "Bole Road, Addis Ababa", speed: 45, fuel: 83 },
    { time: "10:55 AM", address: "Addis-Adama Toll Expressway, KM 20", speed: 90, fuel: 79 },
    { time: "11:30 AM", address: "Adama Toll Gate", speed: 20, fuel: 74 },
    { time: "11:45 AM", address: "Adama Regional Logistics Node", speed: 0, fuel: 73, event: "Cargo Dispatched" },
  ],
  "veh-002": [
    { time: "08:15 AM", address: "Addis Ababa HQ (Arat Kilo)", speed: 0, fuel: 95, event: "Trip Started" },
    { time: "09:00 AM", address: "Debre Zeyit Road", speed: 50, fuel: 92 },
    { time: "10:30 AM", address: "Mojo Junction", speed: 60, fuel: 85 },
    { time: "12:15 PM", address: "Shashemene Town", speed: 40, fuel: 76 },
    { time: "01:00 PM", address: "Hawassa Basin Research Station", speed: 0, fuel: 72, event: "Arrived at Destination" },
  ],
  "veh-003": [
    { time: "02:00 PM", address: "Hawassa Basin Research Station", speed: 0, fuel: 40, event: "Engine Started" },
    { time: "02:15 PM", address: "Hawassa Lake Side Road", speed: 35, fuel: 39 },
    { time: "02:30 PM", address: "Hawassa City Center", speed: 0, fuel: 55, event: "Fuel Refilled (20L)" },
    { time: "03:00 PM", address: "Hawassa Basin Research Station", speed: 0, fuel: 53, event: "Trip Completed" },
  ],
}

export default function VehicleTrackingHistoryPage() {
  const vehicles = useVehicleStore((s) => s.vehicles)
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string>(vehicles[0]?.id || "")

  const history = React.useMemo(() => {
    return mockHistoryLogs[selectedVehicleId] || [
      { time: "12:00 PM", address: "Addis Ababa HQ (Arat Kilo)", speed: 0, fuel: 60, event: "Parked / Idle" },
    ]
  }, [selectedVehicleId])

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="History Tracking"
        description="Review historical route telemetry logs, speeds, events, and location playbacks."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Vehicle</CardTitle>
            <CardDescription>
              Select a vehicle to inspect its route history trail.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Plate Number</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.plateNumber} ({v.make} {v.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedVehicle && (
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Odometer:</span>
                  <span className="font-semibold">{selectedVehicle.odometerKm.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel Capacity:</span>
                  <span className="font-semibold">{selectedVehicle.fuelCapacity} L ({selectedVehicle.fuelType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Location:</span>
                  <span className="font-semibold text-right max-w-[150px] truncate" title={selectedVehicle.location.address}>
                    {selectedVehicle.location.address}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Route Telemetry Timeline</CardTitle>
            <CardDescription>
              Chronological log of GPS events, speeds, and fuel changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l border-muted pl-6 space-y-6 ml-2">
              {history.map((point, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[31px] top-1.5 bg-card border rounded-full p-1 text-primary">
                    {point.event ? (
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Navigation className="w-4 h-4 rotate-45" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {point.time}
                      </span>
                      {point.event && (
                        <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs px-2 py-0.5 rounded font-medium">
                          {point.event}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-sm mt-1 flex items-start">
                      <MapPin className="w-4 h-4 mr-1 text-muted-foreground flex-shrink-0 mt-0.5" />
                      {point.address}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1.5 ml-5">
                      <span>Speed: {point.speed} km/h</span>
                      <span>Fuel Level: {point.fuel}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
