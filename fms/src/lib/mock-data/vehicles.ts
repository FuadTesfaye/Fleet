import { Vehicle } from "@/types"
import { createRNG } from "./rng"

const rng = createRNG(101)

const ethiopianCities: { lat: number; lng: number; address: string }[] = [
  { lat: 9.0192, lng: 38.7525, address: "Addis Ababa, Bole" },
  { lat: 9.0054, lng: 38.7636, address: "Addis Ababa, Kirkos" },
  { lat: 9.0359, lng: 38.7469, address: "Addis Ababa, Yeka" },
  { lat: 8.9806, lng: 38.7578, address: "Addis Ababa, Nifas Silk" },
  { lat: 9.0107, lng: 38.7612, address: "Addis Ababa, Arada" },
  { lat: 8.5400, lng: 39.2700, address: "Adama, Oromia" },
  { lat: 7.0500, lng: 38.4800, address: "Hawassa, Sidama" },
  { lat: 11.5940, lng: 37.3907, address: "Bahir Dar, Amhara" },
  { lat: 13.4967, lng: 39.4753, address: "Mekelle, Tigray" },
  { lat: 9.3100, lng: 42.1200, address: "Dire Dawa" },
  { lat: 7.6800, lng: 36.8300, address: "Jimma, Oromia" },
  { lat: 12.6000, lng: 37.4700, address: "Gondar, Amhara" },
  { lat: 8.2300, lng: 34.5200, address: "Gambella" },
  { lat: 5.9500, lng: 37.5800, address: "Arba Minch, SNNPR" },
  { lat: 9.6000, lng: 41.8500, address: "Harar" },
  { lat: 11.1300, lng: 39.6400, address: "Dessie, Amhara" },
  { lat: 6.0400, lng: 36.3700, address: "Jinka, SNNPR" },
  { lat: 7.7600, lng: 45.5600, address: "Gode, Somali" },
  { lat: 9.5900, lng: 44.0600, address: "Jijiga, Somali" },
  { lat: 11.7500, lng: 40.9600, address: "Semera, Afar" },
  { lat: 8.9900, lng: 38.7900, address: "Addis Ababa, Megenagna" },
  { lat: 9.0300, lng: 38.7200, address: "Addis Ababa, Piazza" },
  { lat: 8.9500, lng: 38.7300, address: "Addis Ababa, Kality" },
  { lat: 9.0400, lng: 38.7600, address: "Addis Ababa, Arat Kilo" },
  { lat: 9.0150, lng: 38.7400, address: "Addis Ababa, Mexico" },
  { lat: 8.9700, lng: 38.7800, address: "Addis Ababa, CMC" },
  { lat: 9.0250, lng: 38.7300, address: "Addis Ababa, Sarbet" },
  { lat: 8.9600, lng: 38.7500, address: "Addis Ababa, Gotera" },
  { lat: 9.0500, lng: 38.7700, address: "Addis Ababa, Gerji" },
  { lat: 9.0100, lng: 38.7100, address: "Addis Ababa, Lideta" },
]

const departments = [
  "dept-001",
  "dept-002",
  "dept-003",
  "dept-004",
  "dept-005",
]

const vehicleData: {
  make: string
  model: string
  fuelType: "diesel" | "petrol"
  capacity: number
}[] = [
  { make: "Toyota", model: "Land Cruiser 200", fuelType: "diesel", capacity: 93 },
  { make: "Toyota", model: "Land Cruiser 76", fuelType: "diesel", capacity: 130 },
  { make: "Toyota", model: "Hilux 2.8D", fuelType: "diesel", capacity: 80 },
  { make: "Toyota", model: "Hilux 2.4D", fuelType: "diesel", capacity: 80 },
  { make: "Isuzu", model: "NPR Truck", fuelType: "diesel", capacity: 100 },
  { make: "Isuzu", model: "FTR Truck", fuelType: "diesel", capacity: 200 },
  { make: "Toyota", model: "Corolla", fuelType: "petrol", capacity: 55 },
  { make: "Toyota", model: "RAV4", fuelType: "petrol", capacity: 55 },
  { make: "Nissan", model: "Patrol", fuelType: "diesel", capacity: 140 },
  { make: "Mitsubishi", model: "L200", fuelType: "diesel", capacity: 75 },
]

const colors = ["White", "Silver", "Black", "Blue", "Red", "Gray", "Green", "Beige"]

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + rng() * (end.getTime() - start.getTime()))
}

function generatePlate(index: number): string {
  const codes = ["AA", "OR", "AM", "TG", "DD", "SM", "AF", "SD", "GM", "BG", "HR"]
  const code = codes[index % codes.length]
  const num = String(10000 + Math.floor(rng() * 89999)).slice(0, 5)
  return `${code} ${num}`
}

function generateChassis(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 17; i++) {
    result += chars.charAt(Math.floor(rng() * chars.length))
  }
  return result
}

function generateEngine(): string {
  const prefix = ["2GD", "1GD", "4JJ", "4HK", "1ZZ", "2TR", "TB48", "4N15"]
  return `${prefix[Math.floor(rng() * prefix.length)]}-${String(Math.floor(rng() * 9999999)).padStart(7, "0")}`
}

const statuses: ("active" | "maintenance" | "idle" | "out_of_service")[] = [
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active",
  "maintenance", "maintenance", "maintenance", "maintenance",
  "idle", "idle", "idle", "idle", "idle",
  "out_of_service", "out_of_service", "out_of_service", "out_of_service",
]

export const mockVehicles: Vehicle[] = Array.from({ length: 30 }, (_, i) => {
  const vd = vehicleData[i % vehicleData.length]
  const year = 2015 + Math.floor(rng() * 10)
  const odometerKm = Math.floor(30000 + rng() * 220000)
  const nextMaintenanceKm = Math.ceil(odometerKm / 10000) * 10000 + 10000
  const purchasePrice = 800000 + Math.floor(rng() * 4500000)

  return {
    id: `veh-${String(i + 1).padStart(3, "0")}`,
    plateNumber: generatePlate(i),
    make: vd.make,
    model: vd.model,
    year,
    color: colors[i % colors.length],
    chassisNumber: generateChassis(),
    engineNumber: generateEngine(),
    fuelType: vd.fuelType,
    fuelCapacity: vd.capacity,
    currentFuelLevel: Math.floor(vd.capacity * (0.15 + rng() * 0.85)),
    odometerKm,
    status: statuses[i],
    assignedDriverId: i < 15 ? `drv-${String(i + 1).padStart(3, "0")}` : undefined,
    insuranceExpiryDate: randomDate(new Date("2026-01-01"), new Date("2027-06-30")),
    licenseExpiryDate: randomDate(new Date("2026-03-01"), new Date("2027-12-31")),
    nextMaintenanceKm,
    lastMaintenanceDate: randomDate(new Date("2025-08-01"), new Date("2026-05-01")),
    purchaseDate: new Date(`${year}-${String(1 + Math.floor(rng() * 12)).padStart(2, "0")}-15`),
    purchasePrice,
    departmentId: departments[i % departments.length],
    location: ethiopianCities[i % ethiopianCities.length],
    createdAt: randomDate(new Date("2024-01-01"), new Date("2025-06-01")),
  }
})
