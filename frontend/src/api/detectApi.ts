import { apiClient } from './client';
import type { DetectionResponse } from '../types/detection';

export async function detectFromImageFile(
  file: File,
  confThreshold?: number
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (confThreshold !== undefined) {
    formData.append('conf_threshold', confThreshold.toString());
  }
  formData.append('save_to_db', 'true');

  return apiClient<DetectionResponse>('/api/v1/detect', {
    method: 'POST',
    body: formData,
  });
}

export async function detectFromBase64(
  base64Data: string,
  imageName?: string,
  confThreshold?: number,
  saveToDb: boolean = true
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append('image_base64', base64Data);
  if (imageName) formData.append('image_name', imageName);
  if (confThreshold !== undefined) {
    formData.append('conf_threshold', confThreshold.toString());
  }
  formData.append('save_to_db', saveToDb ? 'true' : 'false');

  return apiClient<DetectionResponse>('/api/v1/detect', {
    method: 'POST',
    body: formData,
  });
}
