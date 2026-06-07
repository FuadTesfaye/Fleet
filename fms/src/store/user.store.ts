import { create } from "zustand"
import { User } from "@/types"
import { mockUsers } from "@/lib/mock-data"

interface UserState {
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt" | "isActive">) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  toggleUserStatus: (id: string) => void
  getById: (id: string) => User | undefined
}

export const useUserStore = create<UserState>()((set, get) => ({
  users: mockUsers,

  addUser: (userData) => {
    const newUser: User = {
      ...userData,
      id: `usr-${String(get().users.length + 1).padStart(3, "0")}`,
      isActive: true,
      createdAt: new Date(),
    }
    set((state) => ({ users: [...state.users, newUser] }))
  },

  updateUser: (id, data) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }))
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }))
  },

  toggleUserStatus: (id) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      ),
    }))
  },

  getById: (id) => get().users.find((u) => u.id === id),
}))
