import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useVehicleStore } from '@/store/vehicle.store';
import { Vehicle, VehicleStatus } from '@/types';
import { simulatedFetch } from '@/lib/api-client';

export const VEHICLE_QUERY_KEYS = {
  all: ['vehicles'] as const,
  detail: (id: string) => ['vehicles', id] as const,
  byStatus: (status: VehicleStatus) => ['vehicles', 'status', status] as const,
};

// --- API Service layer (using Zustand as DB) ---

const vehicleApi = {
  getVehicles: async () => {
    return simulatedFetch(() => useVehicleStore.getState().vehicles);
  },
  getVehicleById: async (id: string) => {
    return simulatedFetch(() => useVehicleStore.getState().getById(id));
  },
  createVehicle: async (data: Omit<Vehicle, "id" | "createdAt">) => {
    return simulatedFetch(() => {
      useVehicleStore.getState().addVehicle(data);
      return true;
    });
  },
  updateVehicle: async (params: { id: string; data: Partial<Vehicle> }) => {
    return simulatedFetch(() => {
      useVehicleStore.getState().updateVehicle(params.id, params.data);
      return true;
    });
  },
  deleteVehicle: async (id: string) => {
    return simulatedFetch(() => {
      useVehicleStore.getState().deleteVehicle(id);
      return true;
    });
  },
  updateStatus: async (params: { id: string; status: VehicleStatus }) => {
    return simulatedFetch(() => {
      useVehicleStore.getState().updateStatus(params.id, params.status);
      return true;
    });
  }
};

// --- React Query Hooks ---

export function useVehicles() {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.all,
    queryFn: vehicleApi.getVehicles,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.detail(id),
    queryFn: () => vehicleApi.getVehicleById(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehicleApi.createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehicleApi.updateVehicle,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehicleApi.deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
    },
  });
}

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehicleApi.updateStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.detail(variables.id) });
    },
  });
}
