export interface HistoryRecord {
  id: number;
  timestamp: string;
  count: number;
  avg_confidence: number;
  inference_time_ms: number;
  image_name?: string;
}

export interface HistoryResponse {
  total: number;
  records: HistoryRecord[];
}

export interface HistoryFilters {
  minConfidence?: number;
  minCount?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
