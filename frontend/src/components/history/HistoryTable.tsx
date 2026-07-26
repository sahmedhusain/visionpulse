import React from 'react';
import type { HistoryRecord } from '../../types/history';
import { Badge } from '../common/Badge';

interface HistoryTableProps {
  records: HistoryRecord[];
  total?: number;
  isLoading: boolean;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading detection logs...
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No detection records found. Run a detection scan to populate logs.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '0.75rem 1rem' }}>ID</th>
            <th style={{ padding: '0.75rem 1rem' }}>Timestamp (UTC)</th>
            <th style={{ padding: '0.75rem 1rem' }}>Frame / File</th>
            <th style={{ padding: '0.75rem 1rem' }}>Count</th>
            <th style={{ padding: '0.75rem 1rem' }}>Avg Confidence</th>
            <th style={{ padding: '0.75rem 1rem' }}>Inference Speed</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => {
            const formattedTime = new Date(r.timestamp).toLocaleString();
            return (
              <tr
                key={r.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s ease' }}
              >
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>#{r.id}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{formattedTime}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-cyan)' }}>{r.image_name || 'Stream Frame'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge variant={r.count >= 5 ? 'rose' : 'cyan'}>
                    {r.count} {r.count === 1 ? 'Person' : 'People'}
                  </Badge>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  {Math.round(r.avg_confidence * 100)}%
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-purple)' }}>
                  {r.inference_time_ms} ms
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
