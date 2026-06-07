import { z } from "zod"

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
  liters: z.number().positive("Must be positive").max(200, "Cannot exceed 200 liters"),
  costPerLiter: z.number().positive("Must be positive"),
  odometerAtFill: z.number().positive("Must be positive"),
  fuelType: z.enum(["diesel", "petrol", "lpg"]),
  station: z.string().min(2, "Station name must be at least 2 characters"),
  date: z.date(),
  requestedById: z.string().min(1, "Requested by is required"),
})

export type FuelLogFormValues = z.infer<typeof fuelLogSchema>
