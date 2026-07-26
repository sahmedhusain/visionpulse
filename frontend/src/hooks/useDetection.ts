import { useState } from 'react';
import type { DetectionResponse } from '../types/detection';
import { detectFromImageFile, detectFromBase64 } from '../api/detectApi';

export function useDetection() {
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File, confThreshold?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await detectFromImageFile(file, confThreshold);
      setResult(res);
      return res;
    } catch (err: any) {
      const msg = err.message || 'Detection failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const processBase64 = async (base64Data: string, imageName?: string, confThreshold?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await detectFromBase64(base64Data, imageName, confThreshold);
      setResult(res);
      return res;
    } catch (err: any) {
      const msg = err.message || 'Detection failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    result,
    isLoading,
    error,
    processFile,
    processBase64
  };
}
