const API_BASE = "";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function loginRequest(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(email, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchBag() {
  return apiFetch("/bag");
}

export async function saveBag(ownedDiscs, bags) {
  return apiFetch("/bag", {
    method: "PUT",
    body: JSON.stringify({ ownedDiscs, bags }),
  });
}

export async function fetchProfile() {
  return apiFetch("/profile");
}

export async function updateProfile(username, throwDistance) {
  return apiFetch("/profile", {
    method: "PUT",
    body: JSON.stringify({ username, throwDistance }),
  });
}

export async function changePassword(currentPassword, newPassword) {
  return apiFetch("/profile/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}