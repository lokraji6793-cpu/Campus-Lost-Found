import { LostFoundItem, ItemFormData, DashboardStats } from './types';

// Central API Configuration
// When running inside this full-stack deployment, relative URL '/api' routes directly to our backend server
export const API_BASE_URL = '/api';

export interface FetchItemsParams {
  search?: string;
  status?: string;
  category?: string;
  ordering?: string;
}

/**
 * Handle API responses and uniform error extraction
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText || 'Server communication error' };
    }

    const errorMessage = 
      errorData.error || 
      (errorData.validation_errors ? Object.values(errorData.validation_errors).join(' ') : null) ||
      'Unable to connect to server. Please try again.';
      
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.validationErrors = errorData.validation_errors;
    throw error;
  }

  // 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * GET /api/items/
 * Read all items from backend database with optional search, status, category, ordering
 */
export async function getItems(params: FetchItemsParams = {}): Promise<LostFoundItem[]> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'All') query.set('status', params.status);
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.ordering) query.set('ordering', params.ordering);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/items/${queryString}`);
  return handleResponse<LostFoundItem[]>(response);
}

/**
 * GET /api/items/{id}/
 * Read a single item by primary key
 */
export async function getItem(id: number | string): Promise<LostFoundItem> {
  const response = await fetch(`${API_BASE_URL}/items/${id}/`);
  return handleResponse<LostFoundItem>(response);
}

/**
 * POST /api/items/
 * Create a new Lost or Found item
 */
export async function createItem(data: ItemFormData): Promise<LostFoundItem> {
  const response = await fetch(`${API_BASE_URL}/items/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<LostFoundItem>(response);
}

/**
 * PUT /api/items/{id}/ or PATCH /api/items/{id}/
 * Update existing item record
 */
export async function updateItem(
  id: number | string, 
  data: Partial<ItemFormData>,
  partial: boolean = false
): Promise<LostFoundItem> {
  const method = partial ? 'PATCH' : 'PUT';
  const response = await fetch(`${API_BASE_URL}/items/${id}/`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<LostFoundItem>(response);
}

/**
 * DELETE /api/items/{id}/
 * Remove item from database
 */
export async function deleteItem(id: number | string): Promise<{ message: string; id: number }> {
  const response = await fetch(`${API_BASE_URL}/items/${id}/`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string; id: number }>(response);
}

/**
 * POST /api/items/{id}/mark_returned/
 * Mark an item as Returned
 */
export async function markReturned(id: number | string): Promise<{ message: string; item: LostFoundItem }> {
  const response = await fetch(`${API_BASE_URL}/items/${id}/mark_returned/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<{ message: string; item: LostFoundItem }>(response);
}

/**
 * GET /api/stats/
 * Fetch dynamic statistics for dashboard
 */
export async function getStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/stats/`);
  return handleResponse<DashboardStats>(response);
}

/**
 * POST /api/reset-sample/
 * Reset sample data in database
 */
export async function resetSampleData(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/reset-sample/`, {
    method: 'POST',
  });
  return handleResponse<{ message: string }>(response);
}
