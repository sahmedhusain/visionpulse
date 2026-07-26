import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      style={{
        border: '2px dashed rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        disabled={isLoading}
      />
      <div style={{ background: 'rgba(56, 189, 248, 0.12)', padding: '12px', borderRadius: '50%', color: 'var(--accent-cyan)' }}>
        <UploadCloud size={32} />
      </div>
      <div>
        <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
          Drag & Drop frame or <span style={{ color: 'var(--accent-cyan)' }}>Browse</span>
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Supports JPEG, PNG, WEBP (Max 10MB)
        </p>
      </div>
    </div>
  );
};
