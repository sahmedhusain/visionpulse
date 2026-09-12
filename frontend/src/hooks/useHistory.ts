import { useState, useEffect, useCallback } from 'react';
import type { HistoryResponse, HistoryFilters } from '../types/history';
import { getHistory, resetHistory, exportHistoryCsv } from '../api/historyApi';

export function useHistory() {
  const [data, setData] = useState<HistoryResponse>({ total: 0, records: [] });
  const [filters, setFilters] = useState<HistoryFilters>({ limit: 100, offset: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getHistory(filters);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const clearLogs = async () => {
    try {
      await resetHistory();
      await fetchLogs();
    } catch (err: any) {
      setError(err.message || 'Failed to clear history');
    }
  };

  const exportCsv = async () => {
    try {
      const csvStr = await exportHistoryCsv();
      const blob = new Blob([csvStr], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visionpulse_history_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to export CSV');
    }
  };

  return {
    data,
    filters,
    setFilters,
    isLoading,
    error,
    fetchLogs,
    clearLogs,
    exportCsv
  };
}
