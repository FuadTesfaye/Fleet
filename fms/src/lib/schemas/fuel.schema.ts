import { z } from "zod"

export const fuelLogSchema = z.object({
  vehicleId: z.string({ required_error: "Vehicle is required" }).min(1, "Vehicle is required"),
  driverId: z.string({ required_error: "Driver is required" }).min(1, "Driver is required"),
  liters: z.number({ required_error: "Liters required" }).positive("Must be positive").max(200, "Cannot exceed 200 liters"),
  costPerLiter: z.number({ required_error: "Cost per liter required" }).positive("Must be positive"),
  odometerAtFill: z.number({ required_error: "Odometer reading required" }).positive("Must be positive"),
  fuelType: z.enum(["diesel", "petrol", "lpg"], { required_error: "Fuel type is required" }),
  station: z.string().min(2, "Station name must be at least 2 characters"),
  date: z.date({ required_error: "Date is required" }),
  requestedById: z.string().min(1, "Requested by is required"),
})

export type FuelLogFormValues = z.infer<typeof fuelLogSchema>
