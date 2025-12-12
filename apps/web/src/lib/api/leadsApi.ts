import { Lead } from '@kompass/shared';
import { api } from '../api';

export interface CreateLeadData {
    companyName: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    source: string;
    notes?: string;
    website?: string;
    city?: string;
    country?: string;
    position?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
    status?: string;
}

export const leadsApi = {
    getAll: async (params?: { search?: string }) => {
        const response = await api.get<Lead[]>('/leads', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Lead>(`/leads/${id}`);
        return response.data;
    },

    create: async (data: CreateLeadData) => {
        const response = await api.post<Lead>('/leads', data);
        return response.data;
    },

    update: async (id: string, data: UpdateLeadData) => {
        const response = await api.put<Lead>(`/leads/${id}`, data);
        return response.data;
    },

    convert: async (id: string) => {
        const response = await api.post<any>(`/leads/${id}/convert`);
        return response.data;
    },
};
