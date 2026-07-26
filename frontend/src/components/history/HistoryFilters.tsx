import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import type { HistoryFilters as FilterType } from '../../types/history';
import { Button } from '../common/Button';

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
    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filter & Refine Detections</span>
        </div>
        <Button variant="secondary" icon={<RotateCcw size={14} />} onClick={onResetFilters} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
          Clear Filters
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Min Confidence Threshold: {Math.round((filters.minConfidence || 0) * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={filters.minConfidence || 0}
            onChange={(e) => onFilterChange({ ...filters, minConfidence: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Min Person Count
          </label>
          <input
            type="number"
            min={0}
            max={50}
            placeholder="e.g. 2"
            value={filters.minCount !== undefined ? filters.minCount : ''}
            onChange={(e) => onFilterChange({ ...filters, minCount: e.target.value ? parseInt(e.target.value) : undefined })}
            style={{
              width: '100%',
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              color: '#fff',
              padding: '6px 10px',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>
    </div>
  );
};
