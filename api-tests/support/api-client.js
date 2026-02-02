// api-tests/support/api-client.js

const CREDENTIALS = Object.freeze({
  ADMIN: {
    username: "admin",
    password: "admin123",
    role: "ROLE_ADMIN",
  },
  USER: {
    username: "testuser",
    password: "test123",
    role: "ROLE_USER",
  },
});

function getBaseUrl() {
  return (
    Cypress.env("apiBaseUrl") ||
    Cypress.env("API_BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:8080"
  );
}

function buildAuthHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

function apiRequest({ method, path, token, qs, body, failOnStatusCode = false }) {
  const url = `${getBaseUrl()}${path}`;

  return cy.request({
    method,
    url,
    qs,
    body,
    failOnStatusCode,
    headers: {
      ...(token ? buildAuthHeader(token) : {}),
      "Content-Type": "application/json",
    },
  });
}

function apiLogin({ username, password }) {
  return apiRequest({
    method: "POST",
    path: "/api/auth/login",
    body: { username, password },
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(
        `[LOGIN FAILED] Expected 200 but got ${res.status}. ` +
          `Response: ${JSON.stringify(res.body)}`
      );
    }

    const token = res.body?.token;
    if (!token) {
      throw new Error(
        `[LOGIN FAILED] Response did not contain "token". Response: ${JSON.stringify(
          res.body
        )}`
      );
    }

    return token;
  });
}

function getCredentialsFor(role) {
  const normalized = String(role).toUpperCase();

  if (normalized !== "USER" && normalized !== "ADMIN") {
    throw new Error(`[CONFIG] Unknown role "${role}". Use "USER" or "ADMIN".`);
  }

  return { ...CREDENTIALS[normalized] };
}

module.exports = {
  getBaseUrl,
  apiRequest,
  apiLogin,
  getCredentialsFor,
};
