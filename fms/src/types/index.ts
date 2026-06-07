// ============================================================
// Fleet Management System — Shared Types
// Ethiopian Ministry of Irrigation and Lowlands
// ============================================================

export type UserRole =
  | "super_admin"
  | "basic_service_manager"
  | "transport_deployment_head"
  | "transport_deployment_expert"
  | "maintenance_expert"
  | "driver"
  | "ict_department"

export type VehicleStatus =
  | "active"
  | "maintenance"
  | "idle"
  | "out_of_service"
  | "transferred"

export type RequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed"

export type FuelType = "diesel" | "petrol" | "lpg"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  phone: string
  avatar?: string
  createdAt: Date
  isActive: boolean
}

export interface Vehicle {
  id: string
  plateNumber: string
  make: string
  model: string
  year: number
  color: string
  chassisNumber: string
  engineNumber: string
  fuelType: FuelType
  fuelCapacity: number
  currentFuelLevel: number
  odometerKm: number
  status: VehicleStatus
  assignedDriverId?: string
  insuranceExpiryDate: Date
  licenseExpiryDate: Date
  nextMaintenanceKm: number
  lastMaintenanceDate: Date
  purchaseDate: Date
  purchasePrice: number
  departmentId: string
  location: { lat: number; lng: number; address: string }
  createdAt: Date
}

export interface Driver {
  id: string
  userId: string
  name: string
  licenseNumber: string
  licenseClass: string
  licenseExpiryDate: Date
  phone: string
  dateOfBirth: Date
  hireDate: Date
  assignedVehicleId?: string
  totalTrips: number
  totalKm: number
  violations: number
  performance: number
  isActive: boolean
}

export interface FuelLog {
  id: string
  vehicleId: string
  driverId: string
  date: Date
  liters: number
  costPerLiter: number
  totalCost: number
  odometerAtFill: number
  fuelType: FuelType
  station: string
  requestedById: string
  approvedById?: string
  status: RequestStatus
}

export interface MaintenanceRequest {
  id: string
  vehicleId: string
  driverId: string
  requestDate: Date
  issueDescription: string
  urgency: "low" | "medium" | "high" | "critical"
  status: RequestStatus
  workOrderId?: string
  maintenanceCost?: number
  completedDate?: Date
}

export interface WorkOrder {
  id: string
  maintenanceRequestId: string
  vehicleId: string
  assignedMechanicId: string
  description: string
  createdAt: Date
  estimatedCompletionDate: Date
  actualCompletionDate?: Date
  status: RequestStatus
  spareParts: SparePart[]
  totalCost: number
}

export interface SparePart {
  id: string
  name: string
  partNumber: string
  quantity: number
  unitCost: number
  totalCost: number
  isReplaced: boolean
}

export interface TransportRequest {
  id: string
  requestedById: string
  requestDate: Date
  purpose: string
  destination: string
  departureDate: Date
  returnDate: Date
  requestType: "pool" | "field"
  status: RequestStatus
  approvedByManagerId?: string
  approvedByHeadId?: string
  assignedVehicleId?: string
  assignedDriverId?: string
}

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  workOrderId?: string
  transportRequestId?: string
  startLocation: string
  endLocation: string
  startTime: Date
  endTime?: Date
  startOdometer: number
  endOdometer?: number
  distanceKm?: number
  fuelUsed?: number
  status: "active" | "completed" | "cancelled"
  purpose: string
}

export interface Incident {
  id: string
  vehicleId: string
  driverId: string
  incidentDate: Date
  location: string
  description: string
  severity: "minor" | "moderate" | "severe" | "total_loss"
  reportedById: string
  insuranceClaimed: boolean
  insuranceClaimAmount?: number
  status: RequestStatus
  attachments: string[]
}

export interface Geofence {
  id: string
  name: string
  description: string
  vehicleIds: string[]
  boundaries: { lat: number; lng: number }[]
  isActive: boolean
  createdAt: Date
}

export interface Alert {
  id: string
  type:
    | "maintenance_due"
    | "insurance_expiry"
    | "license_expiry"
    | "fuel_low"
    | "geofence_breach"
    | "incident"
    | "fuel_request"
    | "maintenance_request"
  title: string
  message: string
  vehicleId?: string
  driverId?: string
  severity: "info" | "warning" | "critical"
  isRead: boolean
  createdAt: Date
}

export interface Department {
  id: string
  name: string
  code: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  basic_service_manager: "Basic Service Manager",
  transport_deployment_head: "Transport Deployment Head",
  transport_deployment_expert: "Transport Deployment Expert",
  maintenance_expert: "Maintenance Expert",
  driver: "Driver",
  ict_department: "ICT Department",
}
