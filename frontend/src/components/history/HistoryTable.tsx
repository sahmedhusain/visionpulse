import React from 'react';
import type { HistoryRecord } from '../../types/history';

interface HistoryTableProps {
  records: HistoryRecord[];
  total?: number;
  isLoading: boolean;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records, isLoading }) => {
  if (isLoading) {
    return (
      <div className="win-inset" style={{ padding: '16px', textAlign: 'center', color: '#808080', fontSize: '11px' }}>
        Fetching database records...
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="win-inset" style={{ padding: '16px', textAlign: 'center', color: '#808080', fontSize: '11px' }}>
        No detection logs found. Perform a detection scan to populate history database.
      </div>
    );
  }

  return (
    <div className="win-inset" style={{ overflowX: 'auto', background: '#ffffff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px', fontFamily: 'monospace' }}>
        <thead>
          <tr style={{ background: '#c0c0c0', borderBottom: '1px solid #808080', color: '#000000', fontWeight: 'bold' }}>
            <th style={{ padding: '4px 8px', borderRight: '1px solid #808080' }}>ID</th>
            <th style={{ padding: '4px 8px', borderRight: '1px solid #808080' }}>Timestamp (UTC)</th>
            <th style={{ padding: '4px 8px', borderRight: '1px solid #808080' }}>Frame / File</th>
            <th style={{ padding: '4px 8px', borderRight: '1px solid #808080' }}>Count</th>
            <th style={{ padding: '4px 8px', borderRight: '1px solid #808080' }}>Avg Confidence</th>
            <th style={{ padding: '4px 8px' }}>Inference Speed</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, index) => {
            const formattedTime = new Date(r.timestamp).toLocaleString();
            return (
              <tr
                key={r.id}
                style={{
                  background: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <td style={{ padding: '4px 8px', borderRight: '1px solid #e0e0e0', color: '#606060' }}>#{r.id}</td>
                <td style={{ padding: '4px 8px', borderRight: '1px solid #e0e0e0', fontWeight: 'bold' }}>{formattedTime}</td>
                <td style={{ padding: '4px 8px', borderRight: '1px solid #e0e0e0', color: '#000080' }}>{r.image_name || 'Stream Frame'}</td>
                <td style={{ padding: '4px 8px', borderRight: '1px solid #e0e0e0', fontWeight: 'bold', color: r.count >= 5 ? '#800000' : '#000000' }}>
                  {r.count} {r.count === 1 ? 'Person' : 'People'}
                </td>
                <td style={{ padding: '4px 8px', borderRight: '1px solid #e0e0e0', color: '#008000', fontWeight: 'bold' }}>
                  {Math.round(r.avg_confidence * 100)}%
                </td>
                <td style={{ padding: '4px 8px', color: '#000080' }}>
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
