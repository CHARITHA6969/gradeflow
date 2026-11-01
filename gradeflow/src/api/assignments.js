const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `API request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

export function getAssignments() {
  return request("/api/v1/assignments");
}

export function createAssignment(payload) {
  return request("/api/v1/assignments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
