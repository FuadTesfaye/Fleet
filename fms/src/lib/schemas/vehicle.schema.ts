import { z } from "zod"

export const vehicleSchema = z.object({
  plateNumber: z.string()
    .min(5, "Plate number required")
    .regex(/^[A-Z]{2}\s\d{5}$/, "Format: 'AA 12345'"),
  make: z.string().min(2, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the far future"),
  color: z.string().min(1, "Color is required"),
  chassisNumber: z.string().min(10, "Chassis number must be at least 10 characters"),
  engineNumber: z.string().min(5, "Engine number must be at least 5 characters"),
  fuelType: z.enum(["diesel", "petrol", "lpg"]),
  fuelCapacity: z.number().positive("Fuel capacity must be positive"),
  purchasePrice: z.number().positive("Purchase price must be positive"),
  insuranceExpiryDate: z.date().min(new Date(), "Insurance must not be expired"),
  licenseExpiryDate: z.date(),
  nextMaintenanceKm: z.number().positive("Next maintenance km must be positive"),
  departmentId: z.string().min(1, "Department is required"),
  purchaseDate: z.date(),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>
