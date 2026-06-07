import { create } from "zustand"
import { Department } from "@/types"
import { mockDivisions } from "@/lib/mock-data"

interface DivisionState {
  divisions: Department[]
  addDivision: (division: Omit<Department, "id">) => void
  updateDivision: (id: string, data: Partial<Department>) => void
  deleteDivision: (id: string) => void
  getById: (id: string) => Department | undefined
}

export const useDivisionStore = create<DivisionState>()((set, get) => ({
  divisions: mockDivisions,

  addDivision: (divisionData) => {
    const newDivision: Department = {
      ...divisionData,
      id: `dept-${String(get().divisions.length + 1).padStart(3, "0")}`,
    }
    set((state) => ({ divisions: [...state.divisions, newDivision] }))
  },

  updateDivision: (id, data) => {
    set((state) => ({
      divisions: state.divisions.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }))
  },

  deleteDivision: (id) => {
    set((state) => ({
      divisions: state.divisions.filter((d) => d.id !== id),
    }))
  },

  getById: (id) => get().divisions.find((d) => d.id === id),
}))
