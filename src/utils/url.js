/**
 * Returns the full URL for static assets served by the backend (e.g. uploaded images).
 */
export function getFullUploadUrl(relativeUrl) {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
    return relativeUrl;
  }
  const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');
  const serverBase = apiBase.replace('/api/v1', '');
  return `${serverBase}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
}
