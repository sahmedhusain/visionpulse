let resolvedBaseUrl: string | null = null;

export async function getApiBaseUrl(): Promise<string> {
  if (resolvedBaseUrl) return resolvedBaseUrl;

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const candidates = envUrl ? [envUrl, 'http://localhost:8000', 'http://localhost:8001'] : ['http://localhost:8000', 'http://localhost:8001'];

  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        resolvedBaseUrl = baseUrl;
        return baseUrl;
      }
    } catch {}
  }

  const fallback = envUrl || 'http://localhost:8000';
  resolvedBaseUrl = fallback;
  return fallback;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = await getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson.detail) errorMessage = errJson.detail;
      } catch {}
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/csv')) {
      return (await response.text()) as unknown as T;
    }

    return response.json();
  } catch (err: any) {
    resolvedBaseUrl = null;
    throw err;
  }
}
