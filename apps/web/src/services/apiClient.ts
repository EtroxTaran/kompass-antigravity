/**
 * API Client Service
 *
 * This service handles all REST API communication with the backend.
 * It abstracts authentication token management and provides typed
 * methods for all API operations.
 */

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// RFC 7807 Problem Details format
interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail: string,
    public type?: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

// Token storage
let authToken: string | null = null;

/**
 * Set the authentication token for API requests
 */
export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

/**
 * Get the current authentication token
 */
export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem("auth_token");
  }
  return authToken;
}

/**
 * Clear authentication token
 */
export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem("auth_token");
}

/**
 * Build headers for API requests
 */
function buildHeaders(
  contentType: string | null = "application/json",
): Headers {
  const headers = new Headers();
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  headers.set("Accept", "application/json");

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/**
 * Parse API response
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    // Try to parse as RFC 7807 Problem Details
    if (
      contentType?.includes("application/problem+json") ||
      contentType?.includes("application/json")
    ) {
      try {
        const problem = (await response.json()) as ProblemDetails;
        throw new ApiError(
          problem.status || response.status,
          problem.title || response.statusText,
          problem.detail || "An error occurred",
          problem.type,
        );
      } catch (e) {
        if (e instanceof ApiError) throw e;
      }
    }
    throw new ApiError(
      response.status,
      response.statusText,
      "An error occurred",
    );
  }

  if (response.status === 204 || !contentType?.includes("application/json")) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Make a GET request
 */
async function get<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(),
  });

  return parseResponse<T>(response);
}

/**
 * Make a POST request
 */
async function post<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
}

/**
 * Make a POST request with FormData (Upload)
 */
async function upload<T>(path: string, formData: FormData): Promise<T> {
  const headers = buildHeaders(null); // Let browser set Content-Type with boundary

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  return parseResponse<T>(response);
}

/**
 * Make a PUT request
 */
async function put<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

/**
 * Make a PATCH request
 */
async function patch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

/**
 * Make a DELETE request
 */
async function del<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  return parseResponse<T>(response);
}

// =============================================================================
// API Resource Types
// =============================================================================

interface ListResponse<T> {
  data: T[];
  total: number;
  limit?: number;
  offset?: number;
}

interface AuthUser {
  _id: string;
  type: "user";
  email: string;
  displayName: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  primaryRole: string;
  active: boolean;
  lastSyncedAt?: string;
}

// =============================================================================
// Auth API
// =============================================================================

export const authApi = {
  /**
   * Get current user profile
   */
  async getMe(): Promise<AuthUser> {
    return get<AuthUser>("/auth/me");
  },

  /**
   * Sync users from Keycloak (admin only)
   */
  async syncUsers(): Promise<{
    message: string;
    synced: number;
    errors: number;
  }> {
    return post("/auth/sync-users");
  },

  /**
   * Get all synced users (admin only)
   */
  async getUsers(): Promise<ListResponse<AuthUser>> {
    return get("/auth/users");
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return get("/auth/health");
  },
};

// =============================================================================
// Customers API
// =============================================================================

export const customersApi = {
  async list(params?: {
    status?: string;
    limit?: string;
    offset?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/customers", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/customers/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/customers", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/customers/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/customers/${id}`);
  },
};

// =============================================================================
// Projects API
// =============================================================================

export const projectsApi = {
  async list(params?: {
    customerId?: string;
    status?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/projects", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/projects/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/projects", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/projects/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/projects/${id}`);
  },
};

// =============================================================================
// Project Tasks API
// =============================================================================

export const projectTasksApi = {
  async list(
    projectId: string,
    params?: { status?: string; phase?: string },
  ): Promise<ListResponse<unknown>> {
    return get(`/projects/${projectId}/tasks`, params);
  },

  async get(projectId: string, taskId: string): Promise<unknown> {
    return get(`/projects/${projectId}/tasks/${taskId}`);
  },

  async create(projectId: string, data: unknown): Promise<unknown> {
    return post(`/projects/${projectId}/tasks`, data);
  },

  async update(
    projectId: string,
    taskId: string,
    data: unknown,
  ): Promise<unknown> {
    return patch(`/projects/${projectId}/tasks/${taskId}`, data);
  },

  async delete(projectId: string, taskId: string): Promise<void> {
    return del(`/projects/${projectId}/tasks/${taskId}`);
  },
};

// =============================================================================
// User Tasks API
// =============================================================================

export const userTasksApi = {
  async list(params?: {
    status?: string;
    priority?: string;
    overdue?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/user-tasks", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/user-tasks/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/user-tasks", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return patch(`/user-tasks/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/user-tasks/${id}`);
  },
};

// =============================================================================
// Activities API
// =============================================================================

export const activitiesApi = {
  async list(params?: {
    customerId?: string;
    type?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/activities", params);
  },

  async getTimeline(customerId: string): Promise<{ data: unknown[] }> {
    return get(`/activities/timeline?customerId=${customerId}`);
  },

  async getFeed(entityId: string, limit: number = 50): Promise<unknown[]> {
    return get(`/activities/feed/${entityId}?limit=${limit}`);
  },

  async get(id: string): Promise<unknown> {
    return get(`/activities/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/activities", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return patch(`/activities/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/activities/${id}`);
  },
};

// =============================================================================
// Notifications API
// =============================================================================

export const notificationsApi = {
  async list(params?: {
    page?: number;
    limit?: number;
  }): Promise<ListResponse<unknown>> {
    return get("/notifications", params as any);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return get("/notifications/unread-count");
  },

  async markAllAsRead(): Promise<{ count: number }> {
    return patch("/notifications/read-all", {});
  },

  async markAsRead(id: string): Promise<unknown> {
    return patch(`/notifications/${id}/read`, {});
  },
};

// =============================================================================
// Offers API
// =============================================================================

export const offersApi = {
  async list(params?: {
    customerId?: string;
    status?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/offers", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/offers/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/offers", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return patch(`/offers/${id}`, data);
  },

  async updateStatus(
    id: string,
    status: string,
    rejectionReason?: string,
  ): Promise<unknown> {
    return patch(`/offers/${id}/status`, { status, rejectionReason });
  },

  async delete(id: string): Promise<void> {
    return del(`/offers/${id}`);
  },
};

// =============================================================================
// Contracts API
// =============================================================================

export const contractsApi = {
  async list(params?: {
    customerId?: string;
    status?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/contracts", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/contracts/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/contracts", data);
  },

  async createFromOffer(offerId: string, data: unknown): Promise<unknown> {
    return post("/contracts/from-offer", {
      offerId,
      ...(data as Record<string, unknown>),
    });
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return patch(`/contracts/${id}`, data);
  },

  async updateStatus(
    id: string,
    status: string,
    signedBy?: string,
  ): Promise<unknown> {
    return patch(`/contracts/${id}/status`, { status, signedBy });
  },

  async sign(
    id: string,
    data: { signedBy: string; signedAt: string },
  ): Promise<unknown> {
    return post(`/contracts/${id}/sign`, data);
  },
};

// =============================================================================
// Opportunities API
// =============================================================================

export const opportunitiesApi = {
  async list(params?: {
    customerId?: string;
    stage?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/opportunities", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/opportunities/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/opportunities", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/opportunities/${id}`, data);
  },

  async markAsWon(
    id: string,
    data: { startDate?: string; projectManagerId?: string; offerId?: string },
  ): Promise<unknown> {
    return post(`/opportunities/${id}/won`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/opportunities/${id}`);
  },
};

// =============================================================================
// Suppliers API
// =============================================================================

export const suppliersApi = {
  async list(params?: { category?: string }): Promise<ListResponse<unknown>> {
    return get("/suppliers", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/suppliers/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/suppliers", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/suppliers/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/suppliers/${id}`);
  },

  async blacklist(id: string, reason: string): Promise<unknown> {
    return put(`/suppliers/${id}/blacklist`, { reason });
  },

  async reinstate(id: string): Promise<unknown> {
    return put(`/suppliers/${id}/reinstate`, {});
  },

  async approve(id: string): Promise<unknown> {
    return put(`/suppliers/${id}/approve`, {});
  },

  async reject(id: string, reason: string): Promise<unknown> {
    return put(`/suppliers/${id}/reject`, { reason });
  },

  async rate(id: string, data: RateSupplierDto): Promise<unknown> {
    return put(`/suppliers/${id}/rate`, data);
  },
};

// =============================================================================
// Materials API
// =============================================================================

export const materialsApi = {
  async list(params?: {
    supplierId?: string;
    category?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/materials", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/materials/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/materials", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/materials/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/materials/${id}`);
  },
};

// =============================================================================
// Invoices API
// =============================================================================

export const invoicesApi = {
  async list(params?: {
    customerId?: string;
    status?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/invoices", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/invoices/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/invoices", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/invoices/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/invoices/${id}`);
  },

  async exportLexware(): Promise<Blob> {
    const headers = buildHeaders();
    const response = await fetch(
      `${API_BASE_URL}/invoices/export?format=lexware`,
      {
        method: "GET",
        headers,
      },
    );
    if (!response.ok) {
      throw new Error("Export failed");
    }
    return response.blob();
  },
};

// =============================================================================
// Contacts API
// =============================================================================

export const contactsApi = {
  async list(params?: { customerId?: string }): Promise<ListResponse<unknown>> {
    return get("/contacts", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/contacts/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/contacts", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/contacts/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/contacts/${id}`);
  },
};

// =============================================================================
// Locations API
// =============================================================================

// =============================================================================
// Lexware Integration API
// =============================================================================

export interface LexwareSyncStatus {
  lastSync: string;
  files: { filename: string; createdAt: string; type: "export" | "import" }[];
  exportPath: string;
  importPath: string;
}

export const lexwareApi = {
  async getStatus(): Promise<LexwareSyncStatus> {
    return get("/integration/lexware/status");
  },

  async triggerExport(): Promise<{ count: number; filename: string }> {
    return post("/integration/lexware/export/trigger", {});
  },

  async triggerImport(): Promise<{
    processedFiles: number;
    invoicesUpdated: number;
  }> {
    return post("/integration/lexware/import/trigger", {});
  },
};

// =============================================================================
// Locations API
// =============================================================================

export const locationsApi = {
  async list(params?: { customerId?: string }): Promise<ListResponse<unknown>> {
    return get("/locations", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/locations/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/locations", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/locations/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/locations/${id}`);
  },
};

// =============================================================================
// Time Entries API
// =============================================================================

export const projectMaterialsApi = {
  list: (projectId: string) =>
    get<ProjectMaterialRequirement[]>(`/projects/${projectId}/materials`),
  create: (projectId: string, data: Partial<ProjectMaterialRequirement>) =>
    post<ProjectMaterialRequirement>(`/projects/${projectId}/materials`, data),
  update: (
    projectId: string,
    id: string,
    data: Partial<ProjectMaterialRequirement>,
  ) =>
    patch<ProjectMaterialRequirement>(
      `/projects/${projectId}/materials/${id}`,
      data,
    ),
  delete: (projectId: string, id: string) =>
    del<void>(`/projects/${projectId}/materials/${id}`),
};

import { ProjectMaterialRequirement, Project } from "@kompass/shared";

export const timeEntriesApi = {
  async list(params?: {
    projectId?: string;
    userId?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/time-entries", params);
  },

  async listMy(params?: {
    limit?: number;
    offset?: number;
  }): Promise<ListResponse<unknown>> {
    return get("/time-entries/my", params as any);
  },

  async getDailyTotal(date: string): Promise<{ totalHours: number }> {
    return get("/time-entries/daily-total", { date });
  },

  async get(id: string): Promise<unknown> {
    return get(`/time-entries/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/time-entries", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/time-entries/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/time-entries/${id}`);
  },
};

// =============================================================================
// Expenses API
// =============================================================================

export const expensesApi = {
  async list(params?: {
    projectId?: string;
    status?: string;
    userId?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/expenses", params);
  },

  async listMy(): Promise<ListResponse<unknown>> {
    return get("/expenses/my");
  },

  async listPending(): Promise<ListResponse<unknown>> {
    return get("/expenses/pending");
  },

  async get(id: string): Promise<unknown> {
    return get(`/expenses/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/expenses", data);
  },

  async createMileage(data: unknown): Promise<unknown> {
    return post("/expenses/mileage", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/expenses/${id}`, data);
  },

  async approve(id: string): Promise<unknown> {
    return put(`/expenses/${id}/approve`, {});
  },

  async reject(id: string, reason: string): Promise<unknown> {
    return put(`/expenses/${id}/reject`, { reason });
  },

  async delete(id: string): Promise<void> {
    return del(`/expenses/${id}`);
  },
};

// =============================================================================
// Tours API
// =============================================================================

export const toursApi = {
  async list(params?: {
    date?: string;
    status?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/tours", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/tours/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/tours", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/tours/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/tours/${id}`);
  },

  async optimize(stops: RouteStop[]): Promise<OptimizedRouteResponse> {
    return post("/tours/optimize", { stops });
  },
};

// Types for route optimization
export interface RouteStop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface OptimizedRouteResponse {
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
}

// =============================================================================
// Comments API
// =============================================================================

export const commentsApi = {
  async add(
    entityType: string,
    entityId: string,
    content: string,
    contextId?: string,
  ): Promise<Comment> {
    return post(`/comments/${entityType}/${entityId}`, { content, contextId });
  },

  async resolve(
    entityType: string,
    entityId: string,
    commentId: string,
  ): Promise<Comment> {
    return put(`/comments/${entityType}/${entityId}/${commentId}/resolve`, {});
  },
};

// =============================================================================
// Inventory API
// =============================================================================

import { CreateInventoryMovementDto, InventoryMovement } from "@kompass/shared";

export const inventoryApi = {
  async recordMovement(
    data: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {
    return post("/inventory/movements", data);
  },

  async getHistory(materialId: string): Promise<InventoryMovement[]> {
    return get(`/inventory/movements/${materialId}`);
  },
};

// =============================================================================
// RFQ API
// =============================================================================

export const rfqApi = {
  async list(): Promise<ListResponse<RequestForQuote>> {
    const data = await get<RequestForQuote[]>("/rfqs");
    // Standardize to ListResponse format which frontend might expect, or just return array if hook handles it.
    // However, existing hook expects array. But generic list response usually returns { data: [], total: ... }
    // RfqService.findAll returns RequestForQuote[] now (I fixed it).
    // But other APIs return ListResponse. Ideally backend should return ListResponse.
    // For now, let's just return what the backend returns.
    // The previous hook implementation expected array.
    // Let's wrap it to match other APIs if needed, but hook calls it directly.
    // Let's simply return the array for now as my backend service returns array.
    return {
      data: data as unknown as RequestForQuote[],
      total: data?.length || 0,
    };
  },

  // Actually, let's look at useRfq.ts again. It calls apiClient.get<RequestForQuote[]>
  // So it expects data directly.

  async getAll(): Promise<RequestForQuote[]> {
    return get<RequestForQuote[]>("/rfqs");
  },

  async get(id: string): Promise<RequestForQuote> {
    return get(`/rfqs/${id}`);
  },

  async create(data: CreateRfqDto): Promise<RequestForQuote> {
    return post("/rfqs", data);
  },

  async send(id: string): Promise<RequestForQuote> {
    return put(`/rfqs/${id}/send`, {});
  },

  async recordQuote(
    id: string,
    data: RecordQuoteDto,
  ): Promise<RequestForQuote> {
    return post(`/rfqs/${id}/quotes`, data);
  },

  async awardQuote(id: string, quoteId: string): Promise<RequestForQuote> {
    return put(`/rfqs/${id}/award/${quoteId}`, {});
  },
};

import {
  RequestForQuote,
  CreateRfqDto,
  RecordQuoteDto,
  RateSupplierDto,
} from "@kompass/shared";

// Mileage API
// =============================================================================

export const mileageApi = {
  async list(params?: {
    vehicleId?: string;
    date?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/mileage", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/mileage/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/mileage", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/mileage/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/mileage/${id}`);
  },
};

// =============================================================================
// Protocols API
// =============================================================================

export const protocolsApi = {
  async list(params?: {
    customerId?: string;
    projectId?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/protocols", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/protocols/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/protocols", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/protocols/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/protocols/${id}`);
  },
};

// =============================================================================
// Transcribe API
// =============================================================================

export const transcribeApi = {
  async transcribe(file: Blob): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append("file", file, "recording.webm");
    return upload<{ text: string }>("/transcribe", formData);
  },
};

// =============================================================================
// Project Costs API
// =============================================================================

export const projectCostsApi = {
  async list(params?: { projectId?: string }): Promise<ListResponse<unknown>> {
    return get("/project-costs", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/project-costs/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/project-costs", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/project-costs/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return del(`/project-costs/${id}`);
  },
};

// =============================================================================
// Purchase Orders API
// =============================================================================

export const purchaseOrdersApi = {
  async list(params?: {
    supplierId?: string;
    projectId?: string;
  }): Promise<ListResponse<unknown>> {
    return get("/purchase-orders", params);
  },

  async get(id: string): Promise<unknown> {
    return get(`/purchase-orders/${id}`);
  },

  async create(data: unknown): Promise<unknown> {
    return post("/purchase-orders", data);
  },

  async update(id: string, data: unknown): Promise<unknown> {
    return put(`/purchase-orders/${id}`, data);
  },

  async sendOrder(id: string): Promise<void> {
    return post(`/purchase-orders/${id}/send`);
  },

  async submitForApproval(id: string): Promise<unknown> {
    return post(`/purchase-orders/${id}/submit`);
  },

  async approve(id: string): Promise<unknown> {
    return post(`/purchase-orders/${id}/approve`);
  },

  async reject(id: string, reason: string): Promise<unknown> {
    return post(`/purchase-orders/${id}/reject`, { reason });
  },

  async delete(id: string): Promise<void> {
    return del(`/purchase-orders/${id}`);
  },
};

// =============================================================================
// Supplier Contracts API
// =============================================================================

export const supplierContractsApi = {
  async list(supplierId: string): Promise<ListResponse<unknown>> {
    return get(`/suppliers/${supplierId}/contracts`);
  },

  async get(id: string): Promise<unknown> {
    return get(`/supplier-contracts/${id}`);
  },

  async create(supplierId: string, data: unknown): Promise<unknown> {
    return post(`/suppliers/${supplierId}/contracts`, data);
  },

  async approve(id: string): Promise<unknown> {
    return put(`/supplier-contracts/${id}/approve`, {});
  },

  async sign(id: string): Promise<unknown> {
    return put(`/supplier-contracts/${id}/sign`, {});
  },
};

// =============================================================================
// Project Subcontractor Assignment API
// =============================================================================
import {
  AssignSubcontractorDto,
  UpdateAssignmentDto,
  RateSubcontractorDto,
  ProjectSubcontractor,
} from "@kompass/shared";

export const projectSubcontractorApi = {
  async assign(
    projectId: string,
    data: AssignSubcontractorDto,
  ): Promise<ProjectSubcontractor> {
    return post(`/projects/${projectId}/subcontractors`, data);
  },

  async findByProject(projectId: string): Promise<ProjectSubcontractor[]> {
    return get(`/projects/${projectId}/subcontractors`);
  },

  async update(
    projectId: string,
    id: string,
    data: UpdateAssignmentDto,
  ): Promise<ProjectSubcontractor> {
    return put(`/projects/${projectId}/subcontractors/${id}`, data);
  },

  async rate(
    projectId: string,
    id: string,
    data: RateSubcontractorDto,
  ): Promise<ProjectSubcontractor> {
    return put(`/projects/${projectId}/subcontractors/${id}/rate`, data);
  },
};

// Search API
export interface SearchHit {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  _matchesPosition?: Record<string, Array<{ start: number; length: number }>>;
}

export interface GlobalSearchResult {
  query: string;
  processingTimeMs: number;
  results: {
    customers: SearchHit[];
    projects: SearchHit[];
    opportunities: SearchHit[];
    suppliers: SearchHit[];
    materials: SearchHit[];
  };
  totalHits: number;
}

export const searchApi = {
  async globalSearch(query: string, limit = 10): Promise<GlobalSearchResult> {
    return get<GlobalSearchResult>("/search", {
      q: query,
      limit: String(limit),
    });
  },
};

// =============================================================================
// Dashboard API
// =============================================================================

export interface GFMetrics {
  totalRevenue: number;
  outstandingRevenue: number;
  pipelineValue: number;
  weightedPipeline: number;
  activeProjectCount: number;
  onTimeProjectCount: number;
  delayedProjectCount: number;
  pipelineStages: {
    stage: string;
    label: string;
    value: number;
    count: number;
    color: string;
  }[];
  monthlyRevenue: {
    month: string;
    revenue: number;
    invoiceCount: number;
  }[];
  projectsByStatus: {
    status: string;
    label: string;
    count: number;
    color: string;
  }[];
  topOpportunities: {
    _id: string;
    title: string;
    customerId: string;
    customerName?: string;
    expectedValue: number;
    probability: number;
    stage: string;
  }[];
  overdueInvoices: {
    count: number;
    totalValue: number;
    invoices: {
      _id: string;
      invoiceNumber: string;
      customerId: string;
      customerName?: string;
      totalGross: number;
      dueDate: string;
      daysOverdue: number;
    }[];
  };
  teamUtilization: {
    userId: string;
    userName: string;
    totalHours: number;
    targetHours: number;
    utilizationPercent: number;
  }[];
}

export const dashboardApi = {
  async getGFMetrics(): Promise<GFMetrics> {
    return get<GFMetrics>("/dashboard/gf/metrics");
  },
};

// Export consolidated API
export const apiClient = {
  auth: authApi,
  customers: customersApi,
  projects: projectsApi,
  projectTasks: projectTasksApi,
  userTasks: userTasksApi,
  activities: activitiesApi,
  offers: offersApi,
  contracts: contractsApi,
  opportunities: opportunitiesApi,
  suppliers: suppliersApi,
  materials: materialsApi,
  invoices: invoicesApi,
  contacts: contactsApi,
  locations: locationsApi,
  projectMaterials: projectMaterialsApi,
  timeEntries: timeEntriesApi,
  expenses: expensesApi,
  tours: toursApi,
  inventory: inventoryApi,
  comments: commentsApi,
  search: searchApi,
  dashboard: dashboardApi,
  portal: {
    requestLink: (email: string) =>
      post("/portal/auth/request-link", { email }),
    verifyToken: (token: string) =>
      post<{ accessToken: string; user: any }>("/portal/auth/verify", {
        token,
      }),
    getProjects: () => get<Project[]>("/portal/projects"),
    getProject: (id: string) => get<Project>(`/portal/projects/${id}`),
  },
  projectSubcontractor: projectSubcontractorApi,
};

export const portalApi = apiClient.portal;

// Export error class for use in components
export { ApiError };
