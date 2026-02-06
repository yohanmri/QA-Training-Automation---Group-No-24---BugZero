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
Then('the response should contain role {string}', (expectedRole) => {
    expect(apiResponse.body).to.have.property('role');
    expect(apiResponse.body.role).to.equal(expectedRole);
    cy.log(`Role validated: ${apiResponse.body.role}`);
});

// Export for use in other step definition files
module.exports = {
    getApiResponse: () => apiResponse,
    getAuthToken: () => authToken,
    setAuthToken: (token) => { authToken = token; }
};
