import React from 'react';
import { Layers } from 'lucide-react';

interface SampleSelectorProps {
  onSelectSample: (sampleName: string, sampleUrl: string) => void;
  selectedSample?: string;
}

const SAMPLE_IMAGES = [
  { name: 'frame1.jpg', label: 'Single Person' },
  { name: 'frame2.jpg', label: '2 People' },
  { name: 'frame3.jpg', label: '3 People Group' },
  { name: 'frame4.jpg', label: 'Office Lobby (4)' },
  { name: 'frame5.jpg', label: 'Store Queue (5)' },
  { name: 'frame6.jpg', label: 'Warehouse (6)' },
  { name: 'frame7.jpg', label: 'Classroom (7)' },
  { name: 'frame8.jpg', label: 'Conference (8)' },
  { name: 'frame9.jpg', label: 'Restricted (9)' },
  { name: 'frame10.jpg', label: 'Hallway (10)' }
];

export const SampleSelector: React.FC<SampleSelectorProps> = ({ onSelectSample, selectedSample }) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <Layers size={16} color="var(--accent-purple)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Demo Benchmark Samples (10 Images)</span>
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {SAMPLE_IMAGES.map((sample) => {
          const url = `/samples/${sample.name}`;
          const isSelected = selectedSample === sample.name;
          return (
            <div
              key={sample.name}
              onClick={() => onSelectSample(sample.name, url)}
              style={{
                flexShrink: 0,
                width: '100px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                background: 'rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <img
                src={url}
                alt={sample.label}
                style={{ width: '100%', height: '60px', objectFit: 'cover' }}
              />
              <div style={{ padding: '4px', fontSize: '0.7rem', textAlign: 'center', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 500 }}>
                {sample.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
