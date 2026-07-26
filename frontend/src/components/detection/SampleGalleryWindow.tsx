import React from 'react';
import { Layers } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';

interface SampleGalleryWindowProps {
  onSelectSample: (sampleName: string, sampleUrl: string) => void;
  selectedSample?: string;
}

const SAMPLE_IMAGES = [
  { name: 'frame1.jpg', label: '1 Person' },
  { name: 'frame2.jpg', label: '9 People' },
  { name: 'frame3.jpg', label: '5 Group' },
  { name: 'frame4.jpg', label: 'Lobby (1)' },
  { name: 'frame5.jpg', label: 'Queue (3)' },
  { name: 'frame6.jpg', label: 'Warehouse (6)' },
  { name: 'frame7.jpg', label: 'Class (5)' },
  { name: 'frame8.jpg', label: 'Hall (10)' },
  { name: 'frame9.jpg', label: 'Zone (3)' },
  { name: 'frame10.jpg', label: 'Crowd (8)' }
];

export const SampleGalleryWindow: React.FC<SampleGalleryWindowProps> = ({ onSelectSample, selectedSample }) => {
  return (
    <WinWindow title="Demo Benchmark Sample Library (10 Images)" icon={<Layers size={14} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        {SAMPLE_IMAGES.map((sample) => {
          const url = `/samples/${sample.name}`;
          const isSelected = selectedSample === sample.name;
          return (
            <div
              key={sample.name}
              onClick={() => onSelectSample(sample.name, url)}
              className={isSelected ? 'win-inset' : 'win-outdent'}
              style={{
                cursor: 'pointer',
                padding: '2px',
                textAlign: 'center',
                background: isSelected ? '#ffffff' : '#c0c0c0'
              }}
            >
              <img
                src={url}
                alt={sample.label}
                style={{ width: '100%', height: '42px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ fontSize: '9px', fontWeight: 'bold', padding: '2px 0' }}>
                {sample.label}
              </div>
            </div>
          );
        })}
      </div>
    </WinWindow>
  );
};
