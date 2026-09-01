export interface LinkSuggestion {
  id: string;
  partId: number;
  vehicleModelId: number;
  platformCode: string;
  source: string;
  confidence: number;
  createdAt?: string;
  dismissedAt?: string | null;
  confirmedAt?: string | null;
}

export interface SuggestionFilter {
  minConfidence?: number;
  maxResults?: number;
  excludeDismissed?: boolean;
  partIds?: number[];
  vehicleIds?: number[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as Partial<ApiResponse<T>> & T;

  if (!response.ok) {
    throw new Error(body.message ?? 'ไม่สามารถเชื่อมต่อข้อมูลความเข้ากันได้');
  }

  return body.data ?? body;
}

function toQueryString(filters?: SuggestionFilter): string {
  if (!filters) return '';

  const params = new URLSearchParams();
  if (filters.minConfidence !== undefined) params.set('minConfidence', String(filters.minConfidence));
  if (filters.maxResults !== undefined) params.set('maxResults', String(filters.maxResults));
  if (filters.excludeDismissed !== undefined) params.set('excludeDismissed', String(filters.excludeDismissed));
  filters.partIds?.forEach((id) => params.append('partIds', String(id)));
  filters.vehicleIds?.forEach((id) => params.append('vehicleIds', String(id)));

  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getSuggestions(filters?: SuggestionFilter): Promise<LinkSuggestion[]> {
  const response = await fetch(`${API_BASE_URL}/compatibility/suggestions${toQueryString(filters)}`);
  return parseApiResponse<LinkSuggestion[]>(response);
}

export async function confirmSuggestion(suggestionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/compatibility/suggestions/${suggestionId}/confirm`, {
    method: 'POST',
  });
  await parseApiResponse<unknown>(response);
}

export async function dismissSuggestion(suggestionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/compatibility/suggestions/${suggestionId}/dismiss`, {
    method: 'POST',
  });
  await parseApiResponse<unknown>(response);
}

export async function confirmBulkSuggestions(suggestionIds: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/compatibility/suggestions/bulk-confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suggestionIds }),
  });
  await parseApiResponse<unknown>(response);
}
