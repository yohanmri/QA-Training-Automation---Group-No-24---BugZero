const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

// Shared state for API responses and tokens
let apiResponse;
let authToken;
let baseUrl;

// Background step
Given('the API is available at {string}', (url) => {
    baseUrl = url;
    cy.log(`API Base URL set to: ${baseUrl}`);
});

// Authentication helper steps - login and save token in one step
Given('I am authenticated as admin', () => {
    const body = {
        username: 'admin',
        password: 'admin123'
    };

    cy.request({
        method: 'POST',
        url: `${baseUrl}/api/auth/login`,
        body: body,
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
        authToken = response.body.token;
        cy.log(`✅ Admin authenticated. Token: ${authToken.substring(0, 20)}...`);
    });
});

Given('I am authenticated as user', () => {
    const body = {
        username: 'testuser',
        password: 'test123'
    };

    cy.request({
        method: 'POST',
        url: `${baseUrl}/api/auth/login`,
        body: body,
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
        authToken = response.body.token;
        cy.log(`✅ User authenticated. Token: ${authToken.substring(0, 20)}...`);
    });
});

// POST request with body
When('I send a POST request to {string} with body:', (endpoint, requestBody) => {
    const body = JSON.parse(requestBody);

    cy.request({
        method: 'POST',
        url: `${baseUrl}${endpoint}`,
        body: body,
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        apiResponse = response;
        cy.log(`Response Status: ${response.status}`);
        cy.log(`Response Body: ${JSON.stringify(response.body)}`);
    });
});

// POST request with Bearer token
When('I send a POST request to {string} with Bearer token', (endpoint) => {
    cy.request({
        method: 'POST',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        apiResponse = response;
        cy.log(`Response Status: ${response.status}`);
        cy.log(`Response Body: ${JSON.stringify(response.body)}`);
    });
});

// GET request without authentication
When('I send a GET request to {string}', (endpoint) => {
    cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        apiResponse = response;
        cy.log(`Response Status: ${response.status}`);
        cy.log(`Response Body: ${JSON.stringify(response.body)}`);
    });
});

// GET request with Bearer token
When('I send a GET request to {string} with Bearer token', (endpoint) => {
    // Add logging to debug token issues
    cy.log(`Using token: ${authToken ? authToken.substring(0, 20) + '...' : 'NO TOKEN'}`);

    if (!authToken) {
        throw new Error('No auth token available! Make sure login succeeded first.');
    }

    cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        apiResponse = response;
        cy.log(`Response Status: ${response.status}`);
        cy.log(`Response Body: ${JSON.stringify(response.body)}`);

        // Log detailed error information for debugging
        if (response.status >= 400) {
            cy.log(`❌ ERROR ${response.status}: ${JSON.stringify(response.body)}`);
            if (response.status === 500) {
                cy.log('⚠️ Server Error - Check backend logs for details');
            }
        }
    });
});

// Validate response status code
Then('the response status code should be {int}', (expectedStatusCode) => {
    expect(apiResponse.status).to.equal(expectedStatusCode);
});

// Validate response body contains a specific string
Then('the response body should contain {string}', (expectedText) => {
    const responseBody = JSON.stringify(apiResponse.body);
    expect(responseBody).to.include(expectedText);
});

// Validate JWT token format
Then('the response should contain a valid JWT token', () => {
    expect(apiResponse.body).to.have.property('token');
    const token = apiResponse.body.token;

    // JWT format validation: header.payload.signature
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    expect(token).to.match(jwtRegex, 'Token should be in valid JWT format');

    cy.log(`Valid JWT Token: ${token.substring(0, 20)}...`);
});

// Save token for subsequent requests
Then('the token should be saved for subsequent requests', () => {
    expect(apiResponse.body).to.have.property('token');
    authToken = apiResponse.body.token;
    cy.log(`Token saved: ${authToken.substring(0, 20)}...`);
});

// Validate role in response (common for both admin and user)
// Note: Some APIs return role in response body, others only in JWT payload
Then('the response should contain role {string}', (expectedRole) => {
    if (apiResponse.body.role) {
        // Role is in response body
        expect(apiResponse.body.role).to.equal(expectedRole);
        cy.log(`Role validated from response: ${apiResponse.body.role}`);
    } else {
        // Role is not in response body - it's in the JWT token payload
        cy.log(`Role not in response body - checking JWT token payload`);

        if (apiResponse.body.token) {
            // Decode JWT to extract role (JWT format: header.payload.signature)
            const token = apiResponse.body.token;
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));

            cy.log(`JWT Payload: ${JSON.stringify(payload)}`);

            // Check for role in various common JWT claim names
            const role = payload.role || payload.roles || payload.authorities || payload.auth;

            if (role) {
                const roleStr = Array.isArray(role) ? role[0] : role;
                expect(roleStr).to.include(expectedRole);
                cy.log(`Role validated from JWT: ${roleStr}`);
            } else {
                cy.log('⚠️ Warning: Role not found in response body or JWT payload');
            }
        }
    }
});

// Export for use in other step definition files
module.exports = {
    getApiResponse: () => apiResponse,
    getAuthToken: () => authToken,
    setAuthToken: (token) => { authToken = token; }
};
