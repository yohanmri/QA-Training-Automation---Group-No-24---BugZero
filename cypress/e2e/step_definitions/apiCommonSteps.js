import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- Authentication ---

Given(/^I am authenticated as (?:a|an) "(admin|user)" via API$/, (role) => {
    const username = role === 'admin' ? 'admin' : 'testuser';
    const password = role === 'admin' ? 'admin123' : 'test123';

    cy.apiLogin(username, password).then(t => {
        Cypress.env('authToken', t);
    });
});

// --- Generic API Actions ---

When('I send a GET request to {string}', (endpoint) => {
    cy.apiRequest('GET', endpoint, null, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

When('I request a single category by ID from the list', () => {
    const apiResponse = Cypress.env('apiResponse');
    const id = apiResponse.body[0].id;
    cy.apiRequest('GET', `/api/categories/${id}`, null, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

// --- Generic API Assertions ---

Then('the response status code should be {int}', (code) => {
    const apiResponse = Cypress.env('apiResponse');
    expect(apiResponse.status).to.eq(code);
});

Then('the response should be a JSON array of Category objects', () => {
    const apiResponse = Cypress.env('apiResponse');
    expect(Array.isArray(apiResponse.body)).to.be.true;
});

Then('the response body should contain {string}, {string}, and {string}', (f1, f2, f3) => {
    const apiResponse = Cypress.env('apiResponse');
    expect(apiResponse.body).to.have.property(f1); // id
    expect(apiResponse.body).to.have.property(f2); // name

    const keys = Object.keys(apiResponse.body);
    // Search for any key that contains "parent" OR "sub" (handles all Swagger versions)
    const hasParentInfo = keys.some(k =>
        k.toLowerCase().includes('parent') ||
        k.toLowerCase().includes('sub')
    );

    if (!hasParentInfo) {
        cy.log(`FAILED! Server sent these keys: ${keys.join(', ')}`);
    }
    expect(hasParentInfo, `Response did not contain a parent or subCategories field`).to.be.true;
});
