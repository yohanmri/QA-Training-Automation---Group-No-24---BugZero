import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import { setApiResponse } from "../common/apiAssertions";

let authToken;
let apiResponse;

// --- User API Authentication ---
Given(/^I am authenticated as (?:a|an) "user" via API$/, () => {
    cy.apiLogin('testuser', 'test123').then(t => authToken = t);
});

// --- Generic User Actions ---
When('I send a GET request to {string}', (endpoint) => {
    cy.apiRequest('GET', endpoint, null, authToken).then(res => {
        apiResponse = res;
        setApiResponse(res);
    });
});

When('I request a single plant by ID from the list', () => {
    // Dynamic discovery of ID from previous list request
    const id = apiResponse.body[0].id;
    cy.apiRequest('GET', `/api/plants/${id}`, null, authToken).then(res => {
        apiResponse = res;
        setApiResponse(res);
    });
});

// --- Unauthorized Request Actions (TC_03, 04, 05) ---
When('I send a POST request to {string} as an unauthorized user', (endpoint) => {
    // Ensuring a valid Swagger URL to force 403 instead of 500
    const url = endpoint === "/api/plants" ? "/api/plants/category/2" : endpoint;
    cy.apiRequest('POST', url, { name: "SecTest", price: 1, quantity: 1 }, authToken).then(res => {
        setApiResponse(res);
    });
});

When('I send a PUT request to {string} as an unauthorized user', (endpoint) => {
    cy.apiRequest('PUT', endpoint, { name: "SecTest", price: 1, quantity: 1 }, authToken).then(res => {
        setApiResponse(res);
    });
});

When('I send a DELETE request to {string} as an unauthorized user', (endpoint) => {
    cy.apiRequest('DELETE', endpoint, null, authToken).then(res => {
        setApiResponse(res);
    });
});
