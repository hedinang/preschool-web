const API_BASE_URL = (import.meta.env.VITE_PRESCHOOL_API_URL || 'http://localhost:7000')
  .replace(/\/+$/, '');

export async function apiRequest(path, { token, method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const responseText = await response.text();
  let payload;
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    payload = { message: responseText };
  }

  if (!response.ok) {
    throw new Error(payload.message || `Yêu cầu API thất bại (${response.status})`);
  }
  if (payload.status && payload.status >= 400) {
    throw new Error(payload.message || `Yêu cầu API thất bại (${payload.status})`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'data')) {
    throw new Error('Phản hồi API không có trường data hợp lệ');
  }
  return payload.data;
}

export function getApiUrl() {
  return API_BASE_URL;
}
