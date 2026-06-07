import { create } from "zustand"
import { Company } from "@/types"
import { mockCompanies } from "@/lib/mock-data"

interface CompanyState {
  companies: Company[]
  addCompany: (company: Omit<Company, "id" | "createdAt" | "isActive">) => void
  updateCompany: (id: string, data: Partial<Company>) => void
  deleteCompany: (id: string) => void
  toggleCompanyStatus: (id: string) => void
  getById: (id: string) => Company | undefined
}

export const useCompanyStore = create<CompanyState>()((set, get) => ({
  companies: mockCompanies,

  addCompany: (companyData) => {
    const newCompany: Company = {
      ...companyData,
      id: `com-${Date.now()}`,
      isActive: true,
      createdAt: new Date(),
    }
    set((state) => ({ companies: [...state.companies, newCompany] }))
  },

  updateCompany: (id, data) => {
    set((state) => ({
      companies: state.companies.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }))
  },

  deleteCompany: (id) => {
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
    }))
  },

  toggleCompanyStatus: (id) => {
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ),
    }))
  },

  getById: (id) => get().companies.find((c) => c.id === id),
}))
