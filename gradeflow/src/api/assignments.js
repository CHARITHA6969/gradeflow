const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }
  if (!response.ok) throw new Error(data?.detail || `API request failed (${response.status})`);
  return response.status === 204 ? null : data;
}

export function loginUser(email, password) {
  return request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerStudent(email, password, signupCode) {
  return request("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, signup_code: signupCode }),
  });
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

export function submitAssignment(assignmentId, content) {
  return request(`/api/v1/assignments/${assignmentId}/submissions`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function getMySubmissions() {
  return request("/api/v1/submissions/mine");
}

export function getAssignmentSubmissions(assignmentId) {
  return request(`/api/v1/assignments/${assignmentId}/submissions`);
}
