import React from 'react';
import type { HistoryRecord, HistoryFilters } from '../../types/history';

interface HistoryTableProps {
  records: HistoryRecord[];
  total?: number;
  isLoading: boolean;
  filters?: HistoryFilters;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records, isLoading, filters }) => {
  if (isLoading) {
    return (
      <div className="win-inset" style={{ padding: '20px', textAlign: 'center', color: '#808080', fontSize: '11px' }}>
        Fetching history records from detecto.db database...
      </div>
    );
  }

  // Apply client-side filters for instant search & count range
  const filteredRecords = records.filter(r => {
    if (filters?.minConfidence && r.avg_confidence < filters.minConfidence) return false;
    if (filters?.minCount !== undefined && r.count < filters.minCount) return false;
    if (filters?.maxCount !== undefined && r.count > filters.maxCount) return false;
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const name = (r.image_name || 'stream frame').toLowerCase();
      if (!name.includes(q) && !r.id.toString().includes(q)) return false;
    }
    return true;
  });

  if (filteredRecords.length === 0) {
    return (
      <div className="win-inset" style={{ padding: '20px', textAlign: 'center', color: '#808080', fontSize: '11px' }}>
        No matching detection logs found. Try clearing filter criteria.
      </div>
    );
  }

  return (
    <div className="win-inset" style={{ overflowX: 'auto', background: '#ffffff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px', fontFamily: 'monospace' }}>
        <thead>
          <tr style={{ background: '#c0c0c0', borderBottom: '1px solid #808080', color: '#000000', fontWeight: 'bold' }}>
            <th style={{ padding: '5px 8px', borderRight: '1px solid #808080' }}>ID</th>
            <th style={{ padding: '5px 8px', borderRight: '1px solid #808080' }}>Timestamp (Local)</th>
            <th style={{ padding: '5px 8px', borderRight: '1px solid #808080' }}>Source / Frame Name</th>
            <th style={{ padding: '5px 8px', borderRight: '1px solid #808080' }}>Occupants Count</th>
            <th style={{ padding: '5px 8px', borderRight: '1px solid #808080' }}>Avg Confidence</th>
            <th style={{ padding: '5px 8px', borderRight: '1px solid #808080' }}>Inference Latency</th>
            <th style={{ padding: '5px 8px' }}>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((r, index) => {
            const formattedTime = new Date(r.timestamp).toLocaleString();
            const riskLabel = r.count >= 8 ? 'HIGH RISK' : r.count >= 4 ? 'MODERATE' : 'NORMAL';
            const riskColor = r.count >= 8 ? '#800000' : r.count >= 4 ? '#ff8c00' : '#008000';

            return (
              <tr
                key={r.id}
                style={{
                  background: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <td style={{ padding: '5px 8px', borderRight: '1px solid #e0e0e0', color: '#606060' }}>#{r.id}</td>
                <td style={{ padding: '5px 8px', borderRight: '1px solid #e0e0e0', fontWeight: 'bold' }}>{formattedTime}</td>
                <td style={{ padding: '5px 8px', borderRight: '1px solid #e0e0e0', color: '#000080' }}>{r.image_name || 'Stream Frame'}</td>
                <td style={{ padding: '5px 8px', borderRight: '1px solid #e0e0e0', fontWeight: 'bold', color: r.count >= 5 ? '#800000' : '#000000' }}>
                  {r.count} {r.count === 1 ? 'Person' : 'People'}
                </td>
                <td style={{ padding: '5px 8px', borderRight: '1px solid #e0e0e0', color: '#008000', fontWeight: 'bold' }}>
                  {Math.round(r.avg_confidence * 100)}%
                </td>
                <td style={{ padding: '5px 8px', borderRight: '1px solid #e0e0e0', color: '#000080' }}>
                  {r.inference_time_ms} ms
                </td>
                <td style={{ padding: '5px 8px', color: riskColor, fontWeight: 'bold' }}>
                  {riskLabel}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
