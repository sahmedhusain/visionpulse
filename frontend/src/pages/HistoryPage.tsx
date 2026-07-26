import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryChart } from '../components/history/HistoryChart';
import { useHistory } from '../hooks/useHistory';
import { Download, Trash2, TrendingUp, History } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { data, filters, setFilters, isLoading, clearLogs, exportCsv } = useHistory();

  const handleResetFilters = () => {
    setFilters({ limit: 100, offset: 0 });
  };

  return (
    <div style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
      <Card
        title="Detection History & Crowd Analytics"
        subtitle={`Total Saved Records: ${data.total}`}
        icon={<History size={20} />}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
          <Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv}>
            Export to CSV
          </Button>
          <Button variant="danger" icon={<Trash2 size={16} />} onClick={clearLogs}>
            Clear History
          </Button>
        </div>

        {/* Analytics Chart */}
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={18} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Crowd Size Trend over Scans</span>
          </div>
          <HistoryChart records={data.records} />
        </div>

        {/* Filter Controls */}
        <HistoryFilters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Records Data Table */}
        <HistoryTable records={data.records} total={data.total} isLoading={isLoading} />
      </Card>
    </div>
  );
};
