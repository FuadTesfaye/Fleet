import { create } from "zustand"
import { FreightOrder, Shipper, Consignee, Commodity, Tariff } from "@/types"

const initialShippers: Shipper[] = [
  { id: "shp-001", name: "Ethiopian Agricultural Business Corp", code: "EABC", contactName: "Bekele Zewdu", phone: "+251911334455", address: "Gotera, Addis Ababa" },
  { id: "shp-002", name: "Oromia Seed Enterprise", code: "OSE", contactName: "Fikru Tolosa", phone: "+251912556677", address: "Bishoftu" },
  { id: "shp-003", name: "National Fertilizer Importers", code: "NFI", contactName: "Hirut Hailu", phone: "+251913778899", address: "Lideta, Addis Ababa" },
]

const initialConsignees: Consignee[] = [
  { id: "cns-001", name: "Amhara Agricultural Input Supply", code: "AAIS", contactName: "Muluken Dessie", phone: "+251915223344", address: "Bahir Dar" },
  { id: "cns-002", name: "Sidama Coffee Farmers Union", code: "SCFU", contactName: "Tsegaye Abebe", phone: "+251916334455", address: "Hawassa" },
  { id: "cns-003", name: "Lowlands Irrigation Project Unit 2", code: "LIPU2", contactName: "Jafar Kedir", phone: "+251917445566", address: "Gode, Somali" },
]

const initialCommodities: Commodity[] = [
  { id: "cmd-001", name: "DAP Fertilizer Bags", code: "FERT-DAP", category: "fertilizer" },
  { id: "cmd-002", name: "Improved Wheat Seed", code: "SEED-WHT", category: "agricultural" },
  { id: "cmd-003", name: "Irrigation Submersible Pumps", code: "MACH-PUMP", category: "machinery" },
  { id: "cmd-004", name: "Reinforced Steel Bars", code: "CNST-STEEL", category: "construction" },
]

const initialTariffs: Tariff[] = [
  { id: "trf-001", routeFrom: "Addis Ababa", routeTo: "Bahir Dar", ratePerTonKm: 4.5, baseTariff: 12000 },
  { id: "trf-002", routeFrom: "Addis Ababa", routeTo: "Hawassa", ratePerTonKm: 3.8, baseTariff: 8500 },
  { id: "trf-003", routeFrom: "Adama", routeTo: "Gode", ratePerTonKm: 6.2, baseTariff: 28000 },
]

const initialFreightOrders: FreightOrder[] = [
  { id: "fo-001", orderNumber: "FO-2026-001", shipperId: "shp-001", consigneeId: "cns-001", commodityId: "cmd-002", weightTons: 24, volumeCbm: 48, origin: "Addis Ababa", destination: "Bahir Dar", status: "pending", freightCost: 22800, createdAt: new Date("2026-06-01") },
  { id: "fo-002", orderNumber: "FO-2026-002", shipperId: "shp-003", consigneeId: "cns-003", commodityId: "cmd-001", weightTons: 40, volumeCbm: 70, origin: "Adama", destination: "Gode", status: "dispatched", assignedVehicleId: "veh-001", freightCost: 52800, createdAt: new Date("2026-06-03") },
  { id: "fo-003", orderNumber: "FO-2026-003", shipperId: "shp-002", consigneeId: "cns-002", commodityId: "cmd-003", weightTons: 8, volumeCbm: 15, origin: "Addis Ababa", destination: "Hawassa", status: "delivered", assignedVehicleId: "veh-002", freightCost: 11540, createdAt: new Date("2026-06-04") },
]

interface FreightState {
  shippers: Shipper[]
  consignees: Consignee[]
  commodities: Commodity[]
  tariffs: Tariff[]
  freightOrders: FreightOrder[]

  addShipper: (shp: Omit<Shipper, "id">) => void
  addConsignee: (cns: Omit<Consignee, "id">) => void
  addCommodity: (cmd: Omit<Commodity, "id">) => void
  addTariff: (trf: Omit<Tariff, "id">) => void
  addFreightOrder: (fo: Omit<FreightOrder, "id" | "orderNumber" | "createdAt" | "status">) => void
  updateFreightOrderStatus: (id: string, status: FreightOrder["status"]) => void
  assignFreightVehicle: (id: string, vehicleId: string) => void
}

export const useFreightStore = create<FreightState>()((set, get) => ({
  shippers: initialShippers,
  consignees: initialConsignees,
  commodities: initialCommodities,
  tariffs: initialTariffs,
  freightOrders: initialFreightOrders,

  addShipper: (shp) => {
    const newShp = { ...shp, id: `shp-${String(get().shippers.length + 1).padStart(3, "0")}` }
    set((state) => ({ shippers: [...state.shippers, newShp] }))
  },

  addConsignee: (cns) => {
    const newCns = { ...cns, id: `cns-${String(get().consignees.length + 1).padStart(3, "0")}` }
    set((state) => ({ consignees: [...state.consignees, newCns] }))
  },

  addCommodity: (cmd) => {
    const newCmd = { ...cmd, id: `cmd-${String(get().commodities.length + 1).padStart(3, "0")}` }
    set((state) => ({ commodities: [...state.commodities, newCmd] }))
  },

  addTariff: (trf) => {
    const newTrf = { ...trf, id: `trf-${String(get().tariffs.length + 1).padStart(3, "0")}` }
    set((state) => ({ tariffs: [...state.tariffs, newTrf] }))
  },

  addFreightOrder: (foData) => {
    const nextNum = get().freightOrders.length + 1
    const newFo: FreightOrder = {
      ...foData,
      id: `fo-${String(nextNum).padStart(3, "0")}`,
      orderNumber: `FO-2026-${String(nextNum).padStart(3, "0")}`,
      status: "pending",
      createdAt: new Date(),
    }
    set((state) => ({ freightOrders: [newFo, ...state.freightOrders] }))
  },

  updateFreightOrderStatus: (id, status) => {
    set((state) => ({
      freightOrders: state.freightOrders.map((fo) => (fo.id === id ? { ...fo, status } : fo)),
    }))
  },

  assignFreightVehicle: (id, vehicleId) => {
    set((state) => ({
      freightOrders: state.freightOrders.map((fo) =>
        fo.id === id ? { ...fo, assignedVehicleId: vehicleId, status: "dispatched" } : fo
      ),
    }))
  },
}))
