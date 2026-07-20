const API_BASE_URL = 'http://localhost:5000';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const resolveUrl = (url) => {
  if (typeof url !== 'string') {
    throw new TypeError('URL deve ser uma string');
  }

  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `${API_BASE_URL}${url}`;
};

export const fetchJson = async (url, options = {}) => {
  const response = await fetch(resolveUrl(url), {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data && data.error ? data.error : response.statusText;
    throw new Error(message || 'Erro na requisição');
  }

  return data;
};

export const postJson = async (path, body = {}) => {
  return fetchJson(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export { API_BASE_URL };
