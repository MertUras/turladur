import { apiRequest } from './api-client';

export type AvailabilityDay = {
  date: string;
  isAvailable: boolean;
  locked: boolean;
  lockReason: 'ASSIGNMENT' | null;
};

export type BusVehicle = {
  id: string;
  plateNumber: string;
  seatLayoutKind: string;
  capacity: number;
  isActive: boolean;
  modelYear: number | null;
  notes?: string | null;
};

export type AgencyVehicleCandidate = {
  id: string;
  plateNumber: string;
  seatLayoutKind: string;
  capacity: number;
  modelYear: number | null;
  busCompany: {
    id: string;
    companyName: string;
    contactEmail: string;
    city: string | null;
  };
  isAvailableForRange: boolean;
  unavailableDayCount: number;
};

export async function getGuideAvailability(
  token: string,
  from: string,
  to: string,
) {
  return apiRequest<AvailabilityDay[]>(
    `/identity/guides/me/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    { token },
  );
}

export async function setGuideAvailability(
  token: string,
  input: { date: string; isAvailable: boolean },
) {
  return apiRequest<AvailabilityDay>('/identity/guides/me/availability', {
    method: 'PUT',
    body: input,
    token,
  });
}

export async function listBusVehicles(token: string) {
  return apiRequest<BusVehicle[]>('/identity/bus-companies/me/vehicles', {
    token,
  });
}

export async function createBusVehicle(
  token: string,
  input: {
    plateNumber: string;
    seatLayoutKind: string;
    modelYear?: number;
    notes?: string;
  },
) {
  return apiRequest<BusVehicle>('/identity/bus-companies/me/vehicles', {
    method: 'POST',
    body: input,
    token,
  });
}

export async function updateBusVehicle(
  token: string,
  vehicleId: string,
  input: {
    plateNumber?: string;
    seatLayoutKind?: string;
    modelYear?: number | null;
    isActive?: boolean;
    notes?: string | null;
  },
) {
  return apiRequest<BusVehicle>(
    `/identity/bus-companies/me/vehicles/${encodeURIComponent(vehicleId)}`,
    {
      method: 'PATCH',
      body: input,
      token,
    },
  );
}

export async function deleteBusVehicle(token: string, vehicleId: string) {
  return apiRequest<{ id: string }>(
    `/identity/bus-companies/me/vehicles/${encodeURIComponent(vehicleId)}`,
    { method: 'DELETE', token },
  );
}

export async function listAgencyVehicles(
  token: string,
  params: {
    from: string;
    to: string;
    kind?: string;
    q?: string;
    availableOnly?: boolean;
  },
) {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
  });
  if (params.kind) query.set('kind', params.kind);
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.availableOnly) query.set('availableOnly', 'true');

  return apiRequest<AgencyVehicleCandidate[]>(
    `/identity/vehicles?${query.toString()}`,
    { token },
  );
}

export async function getVehicleAvailability(
  token: string,
  vehicleId: string,
  from: string,
  to: string,
) {
  return apiRequest<AvailabilityDay[]>(
    `/identity/bus-companies/me/vehicles/${encodeURIComponent(vehicleId)}/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    { token },
  );
}

export async function setVehicleAvailability(
  token: string,
  vehicleId: string,
  input: { date: string; isAvailable: boolean },
) {
  return apiRequest<AvailabilityDay>(
    `/identity/bus-companies/me/vehicles/${encodeURIComponent(vehicleId)}/availability`,
    {
      method: 'PUT',
      body: input,
      token,
    },
  );
}
