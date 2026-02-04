import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const API_BASE_URL = Cypress.env('apiBaseUrl') || 'http://localhost:8080';

let apiResponse;
let userToken;

// -------------------- Given Steps --------------------
Given('I have a valid User JWT token', () => {
    cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/login`,
        body: {
            username: 'user',
            password: 'user123'
        },
        failOnStatusCode: false
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        userToken = response.body.token;
        cy.wrap(userToken).as('userToken');
    });
});

// -------------------- When Steps --------------------
When('I send POST request to {string} with body:', (endpoint, dataTable) => {
    const data = {};
    dataTable.rawTable.forEach(([key, value]) => {
        data[key] = value;
    });

    cy.request({
        method: 'POST',
        url: `${API_BASE_URL}${endpoint}`,
        body: data,
        failOnStatusCode: false
    }).then((response) => {
        apiResponse = response;
        if (response.status === 200 && response.body.token) {
            userToken = response.body.token;
            cy.wrap(userToken).as('userToken');
        }
    });
});

When('I send GET request to {string} with User token', (endpoint) => {
    cy.get('@userToken').then((token) => {
        cy.request({
            method: 'GET',
            url: `${API_BASE_URL}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            apiResponse = response;
        });
    });
});

When('I send GET request to {string} without authentication', (endpoint) => {
    cy.request({
        method: 'GET',
        url: `${API_BASE_URL}${endpoint}`,
        failOnStatusCode: false
    }).then((response) => {
        apiResponse = response;
    });
});

// -------------------- Then Steps --------------------
Then('the response status code should be {int}', (statusCode) => {
    expect(apiResponse.status).to.eq(statusCode);
});

Then('the response body should contain field {string}', (fieldName) => {
    expect(apiResponse.body).to.have.property(fieldName);
});

Then('the response body should contain field {string} with value {string}', (fieldName, expectedValue) => {
    expect(apiResponse.body).to.have.property(fieldName);

    // Handle numeric values
    if (!isNaN(expectedValue)) {
        expect(apiResponse.body[fieldName]).to.eq(Number(expectedValue));
    } else {
        expect(apiResponse.body[fieldName]).to.eq(expectedValue);
    }
});

Then('the token should be a valid JWT format', () => {
    expect(apiResponse.body.token).to.be.a('string');
    // JWT format: header.payload.signature
    expect(apiResponse.body.token).to.match(/^[\w-]+\.[\w-]+\.[\w-]+$/);
});

Then('the response body should contain error message {string}', (errorMessage) => {
    expect(apiResponse.body).to.have.property('message');
    expect(apiResponse.body.message).to.include(errorMessage);
});

Then('the response body should contain validation errors for username and password', () => {
    // This depends on your API's error response structure
    // Adjust based on actual API response
    expect(apiResponse.body).to.have.property('errors');
    // Or check for specific validation messages
});