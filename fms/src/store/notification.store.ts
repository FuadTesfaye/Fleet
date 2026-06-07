import { create } from "zustand"
import { Alert } from "@/types"
import { mockAlerts } from "@/lib/mock-data"

interface NotificationState {
  alerts: Alert[]
  unreadCount: () => number
  markRead: (id: string) => void
  markAllRead: () => void
  dismiss: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  alerts: mockAlerts,

  unreadCount: () => {
    return get().alerts.filter((a) => !a.isRead).length
  },

  markRead: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
    }))
  },

  markAllRead: () => {
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, isRead: true })),
    }))
  },

  dismiss: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    }))
  },
}))
