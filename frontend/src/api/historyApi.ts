import { apiClient } from './client';
import type { HistoryResponse, HistoryFilters } from '../types/history';

export async function getHistory(filters: HistoryFilters = {}): Promise<HistoryResponse> {
  const queryParams = new URLSearchParams();
  if (filters.minConfidence !== undefined) queryParams.append('min_confidence', filters.minConfidence.toString());
  if (filters.minCount !== undefined) queryParams.append('min_count', filters.minCount.toString());
  if (filters.startDate) queryParams.append('start_date', filters.startDate);
  if (filters.endDate) queryParams.append('end_date', filters.endDate);
  if (filters.limit !== undefined) queryParams.append('limit', filters.limit.toString());
  if (filters.offset !== undefined) queryParams.append('offset', filters.offset.toString());

  const queryString = queryParams.toString();
  const endpoint = `/api/v1/history${queryString ? `?${queryString}` : ''}`;
  return apiClient<HistoryResponse>(endpoint);
}

export async function resetHistory(): Promise<{ message: string; deleted_count: number }> {
  return apiClient<{ message: string; deleted_count: number }>('/api/v1/reset', {
    method: 'POST',
  });
}

export async function exportHistoryCsv(): Promise<string> {
  return apiClient<string>('/api/v1/export');
}
