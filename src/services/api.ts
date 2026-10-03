import { Appliance, TariffSchedule, SolarSystemState, AIInsight, TelemetryPoint } from '../types/energy';

const API_BASE = 'http://127.0.0.1:5000/api';

export async function fetchHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    const data = await res.json();
    return data?.status === 'healthy';
  } catch {
    return false;
  }
}

export async function fetchAppliances(): Promise<Appliance[] | null> {
  try {
    const res = await fetch(`${API_BASE}/appliances`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function toggleApplianceApi(id: string): Promise<Appliance | null> {
  try {
    const res = await fetch(`${API_BASE}/appliances/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.appliance;
  } catch {
    return null;
  }
}

export async function addApplianceApi(app: Omit<Appliance, 'id' | 'monthlyCostEstimate'>): Promise<Appliance | null> {
  try {
    const res = await fetch(`${API_BASE}/appliances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.appliance;
  } catch {
    return null;
  }
}

export async function deleteApplianceApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/appliances/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchTelemetryApi(): Promise<Partial<TelemetryPoint> | null> {
  try {
    const res = await fetch(`${API_BASE}/telemetry`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchTariffApi(): Promise<TariffSchedule | null> {
  try {
    const res = await fetch(`${API_BASE}/tariff`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateTariffApi(tariff: TariffSchedule): Promise<TariffSchedule | null> {
  try {
    const res = await fetch(`${API_BASE}/tariff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tariff)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.tariff;
  } catch {
    return null;
  }
}
