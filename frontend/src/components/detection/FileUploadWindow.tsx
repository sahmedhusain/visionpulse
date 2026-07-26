import React, { useRef } from 'react';
import { UploadCloud, Folder } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';

interface FileUploadWindowProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUploadWindow: React.FC<FileUploadWindowProps> = ({ onFileSelect, isLoading }) => {
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
    <WinWindow title="Upload Image File" icon={<Folder size={14} />}>
      <div
        className="win-inset"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '16px',
          textAlign: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff'
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
        <UploadCloud size={24} color="#000080" />
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '11px', margin: 0 }}>
            Drag & Drop image or <span style={{ color: '#000080', textDecoration: 'underline' }}>Browse...</span>
          </p>
          <p style={{ fontSize: '10px', color: '#808080', marginTop: '2px' }}>
            Supports JPEG, PNG, WEBP (Max 10MB)
          </p>
        </div>
      </div>
    </WinWindow>
  );
};
