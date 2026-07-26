import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import type { HistoryFilters as FilterType } from '../../types/history';

interface HistoryFiltersProps {
  filters: FilterType;
  onFilterChange: (newFilters: FilterType) => void;
  onResetFilters: () => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="win-outdent" style={{ padding: '8px', marginBottom: '8px', background: '#c0c0c0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px' }}>
          <Filter size={14} color="#000080" />
          <span>Filter Database Logs</span>
        </div>
        <button className="win-btn" onClick={onResetFilters} style={{ padding: '2px 6px', fontSize: '10px' }}>
          <RotateCcw size={10} /> Reset Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
            Min Confidence: {Math.round((filters.minConfidence || 0) * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={filters.minConfidence || 0}
            onChange={(e) => onFilterChange({ ...filters, minConfidence: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: '#000080' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
            Min Person Count:
          </label>
          <input
            type="number"
            className="win-inset"
            min={0}
            max={50}
            placeholder="e.g. 2"
            value={filters.minCount !== undefined ? filters.minCount : ''}
            onChange={(e) => onFilterChange({ ...filters, minCount: e.target.value ? parseInt(e.target.value) : undefined })}
            style={{ width: '100%', padding: '2px 6px', fontSize: '11px' }}
          />
        </div>
      </div>
    </div>
  );
};
