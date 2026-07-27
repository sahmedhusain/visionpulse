import React, { useState } from 'react';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryAnalyticsSummary } from '../components/history/HistoryAnalyticsSummary';
import { HistorySvgAnalyticsCharts } from '../components/history/HistorySvgAnalyticsCharts';
import { useHistory } from '../hooks/useHistory';
import { Download, Trash2, History, FileText, RefreshCw } from 'lucide-react';
import { WinWindow } from '../components/win98/WinWindow';
import type { HistoryFilters as FilterType } from '../types/history';

export const HistoryPage: React.FC = () => {
  const { data, filters, setFilters, isLoading, clearLogs, exportCsv, fetchLogs } = useHistory();
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const handleResetFilters = () => {
    setFilters({ limit: 100, offset: 0 });
  };

  const exportSummaryReport = () => {
    if (data.records.length === 0) return;

    const totalCountSum = data.records.reduce((acc, r) => acc + r.count, 0);
    const avgCount = (totalCountSum / data.records.length).toFixed(2);
    const peakCount = Math.max(...data.records.map(r => r.count), 0);
    const avgConf = (data.records.reduce((acc, r) => acc + r.avg_confidence, 0) / data.records.length * 100).toFixed(1);

    const reportText = `=====================================================
RPD REAL-TIME PERSON DETECTION SYSTEM - ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}
=====================================================
Total Database Records: ${data.total}
Analyzed Samples: ${data.records.length}
Peak Session Crowd Size: ${peakCount} Persons
Average Occupancy Per Scan: ${avgCount} Persons
Average Neural Confidence: ${avgConf}%
Database Engine: SQLite (detecto.db)
=====================================================
RECENT LOG ENTRIES:
${data.records.slice(0, 10).map(r => `[ID #${r.id}] ${r.timestamp} | Count: ${r.count} | Conf: ${Math.round(r.avg_confidence * 100)}% | Speed: ${r.inference_time_ms}ms`).join('\n')}
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RPD_Analytics_Report_${Date.now()}.txt`;
    a.click();

    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div style={{ padding: '0 8px 50px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* 1. Executive Summary Telemetry Window */}
      <HistoryAnalyticsSummary records={data.records} total={data.total} />

      {/* 2. Suite of 4 Retro SVG Analytics Graphs */}
      <HistorySvgAnalyticsCharts records={data.records} />

      {/* 3. Main History Database & Data Grid Window */}
      <WinWindow
        title={`RPD Detection Database & History Log (${data.total} Total Logged Entries)`}
        icon={<History size={14} />}
        statusBarContent={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 'bold' }}>
            <span>Database: SQLite (detecto.db)</span>
            <span>Total Logged Entries: {data.total}</span>
            <span>Mode: Read/Write</span>
          </div>
        }
      >
        {/* Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="win-btn" onClick={fetchLogs}>
              <RefreshCw size={12} /> Refresh Data
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="win-btn" onClick={exportSummaryReport} style={{ color: '#000080', fontWeight: 'bold' }}>
              <FileText size={12} /> Export Text Report
            </button>
            <button className="win-btn" onClick={exportCsv}>
              <Download size={12} /> Export CSV Data
            </button>
            <button className="win-btn win-btn-danger" onClick={clearLogs}>
              <Trash2 size={12} /> Clear Database
            </button>
          </div>
        </div>

        {reportGenerated && (
          <div className="win-inset" style={{ background: '#d4ffc0', padding: '6px', color: '#008000', fontSize: '11px', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>
            ✓ RPD Analytics Text Report downloaded successfully.
          </div>
        )}

        {/* Filter Controls Window */}
        <HistoryFilters
          filters={filters}
          onFilterChange={(f: FilterType) => setFilters(f)}
          onResetFilters={handleResetFilters}
        />

        {/* Data Table Window */}
        <HistoryTable records={data.records} total={data.total} isLoading={isLoading} filters={filters} />
      </WinWindow>
    </div>
  );
};
