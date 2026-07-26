import React from 'react';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryChart } from '../components/history/HistoryChart';
import { useHistory } from '../hooks/useHistory';
import { Download, Trash2, TrendingUp, History } from 'lucide-react';
import { WinWindow } from '../components/win98/WinWindow';

export const HistoryPage: React.FC = () => {
  const { data, filters, setFilters, isLoading, clearLogs, exportCsv } = useHistory();

  const handleResetFilters = () => {
    setFilters({ limit: 100, offset: 0 });
  };

  return (
    <div style={{ padding: '0 8px 40px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <WinWindow
        title={`RPD Detection Database & History Log (${data.total} Total Records)`}
        icon={<History size={14} />}
        statusBarContent={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>Database: SQLite (detecto.db)</span>
            <span>Total Logged Entries: {data.total}</span>
            <span>Mode: Read/Write</span>
          </div>
        }
      >
        {/* Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginBottom: '8px' }}>
          <button className="win-btn" onClick={exportCsv}>
            <Download size={12} /> Export CSV
          </button>
          <button className="win-btn win-btn-danger" onClick={clearLogs}>
            <Trash2 size={12} /> Clear Database
          </button>
        </div>

        {/* Analytics Chart Box */}
        <div className="win-inset" style={{ padding: '8px', marginBottom: '8px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', fontWeight: 'bold', fontSize: '11px', color: '#000080' }}>
            <TrendingUp size={14} /> RPD Crowd Density Trend Analytics
          </div>
          <HistoryChart records={data.records} />
        </div>

        {/* Filter Controls Window */}
        <HistoryFilters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Data Table Window */}
        <HistoryTable records={data.records} total={data.total} isLoading={isLoading} />
      </WinWindow>
    </div>
  );
};
