const BASE_URL = 'http://localhost:3000';

export async function apiGet(path, token) {
  const response = await fetch('http://localhost:3000' + path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: 'Bearer ' + token })
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
}

export async function apiPost(path, data, token) {
  const response = await fetch('http://localhost:3000' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function apiDelete(endpoint, token = null) {
  const res = await fetch(BASE_URL + endpoint, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  return res.json();
}
