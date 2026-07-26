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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px', color: '#000080' }}>
          <Filter size={14} />
          <span>Advanced Database Query & Filter Engine</span>
        </div>
        <button className="win-btn" onClick={onResetFilters} style={{ padding: '2px 8px', fontSize: '11px' }}>
          <RotateCcw size={11} /> Reset Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
        {/* Search Query Input */}
        <div>
          <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
            Search File / Source:
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="win-inset"
              placeholder="e.g. webcam, frame1..."
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              style={{ width: '100%', padding: '3px 6px', fontSize: '11px' }}
            />
          </div>
        </div>

        {/* Min Confidence Slider */}
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

        {/* Min Person Count */}
        <div>
          <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
            Min People Count:
          </label>
          <input
            type="number"
            className="win-inset"
            min={0}
            max={50}
            placeholder="e.g. 2"
            value={filters.minCount !== undefined ? filters.minCount : ''}
            onChange={(e) => onFilterChange({ ...filters, minCount: e.target.value ? parseInt(e.target.value) : undefined })}
            style={{ width: '100%', padding: '3px 6px', fontSize: '11px' }}
          />
        </div>

        {/* Max Person Count */}
        <div>
          <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
            Max People Count:
          </label>
          <input
            type="number"
            className="win-inset"
            min={0}
            max={50}
            placeholder="e.g. 10"
            value={filters.maxCount !== undefined ? filters.maxCount : ''}
            onChange={(e) => onFilterChange({ ...filters, maxCount: e.target.value ? parseInt(e.target.value) : undefined })}
            style={{ width: '100%', padding: '3px 6px', fontSize: '11px' }}
          />
        </div>
      </div>
    </div>
  );
};
