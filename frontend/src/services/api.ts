import axios from "axios";
import type { Target, LogEntry, Team, HistoryEntry, TargetPayload, IncidentEntry } from "../types";

// Use the global axios instance which has baseURL and 401-refresh interceptor
// configured in interceptors.ts via setupAxios()
export const api = axios;

// ─── Targets ─────────────────────────────────────────────────────────────────

export const targetsApi = {
  getAll: async (teamId: string, signal?: AbortSignal): Promise<Target[]> => {
    const res = await api.get(`/api/teams/${teamId}/targets`, { signal });
    return res.data.targets;
  },

  create: async (teamId: string, payload: TargetPayload): Promise<void> => {
    await api.post(`/api/teams/${teamId}/targets`, payload);
  },

  update: async (teamId: string, targetId: string, payload: TargetPayload): Promise<void> => {
    await api.put(`/api/teams/${teamId}/targets/${targetId}`, payload);
  },

  delete: async (teamId: string, targetId: string): Promise<void> => {
    await api.delete(`/api/teams/${teamId}/targets/${targetId}`);
  },
};

// ─── Teams ───────────────────────────────────────────────────────────────────

export const teamsApi = {
  getAll: async (signal?: AbortSignal): Promise<Team[]> => {
    const res = await api.get("/api/teams", { signal });
    return res.data.teams;
  },

  create: async (name: string): Promise<{ teamId: string }> => {
    const res = await api.post("/api/teams", { name });
    return res.data;
  },

  delete: async (teamId: string): Promise<void> => {
    await api.delete(`/api/teams/${teamId}`);
  },
};

// ─── Logs ────────────────────────────────────────────────────────────────────

export const logsApi = {
  getAll: async (teamId: string, signal?: AbortSignal): Promise<LogEntry[]> => {
    const res = await api.get(`/api/teams/${teamId}/logs`, { signal });
    return res.data.logs;
  },

  clearAll: async (teamId: string): Promise<void> => {
    await api.delete(`/api/teams/${teamId}/logs`);
  },
};

// ─── History ─────────────────────────────────────────────────────────────────

export const historyApi = {
  getByTarget: async (
    teamId: string,
    targetId: string,
    signal?: AbortSignal,
  ): Promise<HistoryEntry[]> => {
    const res = await api.get(
      `/api/teams/${teamId}/targets/${targetId}/history`,
      { signal },
    );
    return res.data.history;
  },
};

export const incidentsApi = {
  getByTarget: async (
    teamId: string,
    targetId: string,
    signal?: AbortSignal,
  ): Promise<IncidentEntry[]> => {
    const res = await api.get(
      `/api/teams/${teamId}/targets/${targetId}/incidents`,
      { signal },
    );
    return res.data.incidents;
  },
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string): Promise<{ userId: string }> => {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  },

  register: async (email: string, password: string): Promise<void> => {
    await api.post("/api/auth/register", { email, password });
  },

  refresh: async (): Promise<void> => {
    await api.post("/api/auth/refresh");
  },
};
