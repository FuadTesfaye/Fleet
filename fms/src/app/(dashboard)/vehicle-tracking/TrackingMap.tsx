"use client"

import React, { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useVehicleStore } from "@/store/vehicle.store"
import { useTripStore } from "@/store/trip.store"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, MapPin } from "lucide-react"

export default function TrackingMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  
  const vehicles = useVehicleStore((s) => s.vehicles)
  const activeTrips = useTripStore((s) => s.activeTrips())
  const getVehicle = useVehicleStore((s) => s.getById)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Set default icon path configurations for Leaflet
    // Since Next.js asset paths can be tricky, we define them manually
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    })

    // Initialize map centering on Addis Ababa HQ coordinates
    const map = L.map(mapRef.current).setView([9.0192, 38.7525], 7)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    // Add active vehicle markers
    vehicles.forEach((vehicle) => {
      const { lat, lng, address } = vehicle.location
      
      const customIcon = L.divIcon({
        className: "custom-leaflet-icon",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute -top-6 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-slate-700">
              ${vehicle.plateNumber}
            </div>
            <div class="w-8 h-8 rounded-full ${
              vehicle.status === "active" ? "bg-emerald-500" :
              vehicle.status === "maintenance" ? "bg-amber-500" : "bg-slate-400"
            } border-2 border-white flex items-center justify-center text-white shadow-lg animate-pulse">
              🚚
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1">
            <h4 class="font-bold text-sm mb-1">${vehicle.make} ${vehicle.model}</h4>
            <p class="text-xs text-slate-500 mb-1">Plate: ${vehicle.plateNumber}</p>
            <p class="text-xs font-medium">Status: <span class="capitalize text-emerald-600 font-semibold">${vehicle.status}</span></p>
            <p class="text-xs text-slate-400 mt-1">${address}</p>
          </div>
        `)

      markersRef.current[vehicle.id] = marker
    })
  }, [vehicles])

  const handleFocusVehicle = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 13, { animate: true })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
      {/* Sidebar List */}
      <div className="col-span-1 border rounded-lg bg-card flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-muted/50 font-semibold flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          Active Fleet ({vehicles.length})
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleFocusVehicle(vehicle.location.lat, vehicle.location.lng)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm">{vehicle.plateNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    vehicle.status === "active" ? "bg-emerald-100 text-emerald-800" :
                    vehicle.status === "maintenance" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{vehicle.make} {vehicle.model}</p>
                  <p className="truncate mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                    {vehicle.location.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="col-span-1 lg:col-span-3 border rounded-lg relative overflow-hidden flex flex-col">
        <div ref={mapRef} className="w-full h-full z-0" style={{ minHeight: "450px" }} />
      </div>
    </div>
  )
}
