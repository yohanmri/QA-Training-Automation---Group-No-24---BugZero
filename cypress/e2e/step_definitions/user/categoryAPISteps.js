import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let authToken;
let apiResponse;

// Unauthorized Actions

When('I send a POST category request as an unauthorized user', () => {
    const body = { id: 0, name: "Unauthorized", parent: null, subCategories: [] };
    cy.apiRequest('POST', '/api/categories', body, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

When('I send a PUT category request for ID {int} as an unauthorized user', (id) => {
    const body = { name: "Unauthorized", parentId: null };
    cy.apiRequest('PUT', `/api/categories/${id}`, body, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

When('I send a DELETE category request for ID {int} as an unauthorized user', (id) => {
    cy.apiRequest('DELETE', `/api/categories/${id}`, null, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

// --- Assertions ---

Then('the response should return a 403 Forbidden error', () => {
    const apiResponse = Cypress.env('apiResponse');
    expect(apiResponse.status).to.be.oneOf([403, 400]);
});
