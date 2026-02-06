import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let authToken;
let apiResponse;
let createdCategoryId;
let createdCategoryName;

function randomLetters(len = 3) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// --- Actions ---

When('I create a main category with name {string}', (name) => {
    const createdCategoryName = name.substring(0, 5) + randomLetters();
    Cypress.env('createdCategoryName', createdCategoryName);
    const body = { id: 0, name: createdCategoryName, parent: null, subCategories: [] };
    cy.apiRequest('POST', '/api/categories', body, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
        Cypress.env('createdCategoryId', res.body.id);
        cy.wait(1000);
    });
});

When('I create a sub-category {string} under the previous category', (name) => {
    const subName = name.substring(0, 5) + randomLetters();
    const body = {
        id: 0,
        name: subName,
        parent: { id: Cypress.env('createdCategoryId'), name: Cypress.env('createdCategoryName') },
        subCategories: []
    };
    cy.apiRequest('POST', '/api/categories', body, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

When('I update the existing category name to {string}', (newName) => {
    const body = { name: newName, parentId: null };
    cy.apiRequest('PUT', `/api/categories/${Cypress.env('createdCategoryId')}`, body, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

When('I delete the category', () => {
    cy.apiRequest('DELETE', `/api/categories/${Cypress.env('createdCategoryId')}`, null, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
        cy.wait(1000);
    });
});

When('I send a GET request to the created category ID', () => {
    cy.apiRequest('GET', `/api/categories/${Cypress.env('createdCategoryId')}`, null, Cypress.env('authToken')).then(res => {
        Cypress.env('apiResponse', res);
    });
});

// --- Assertions ---

Then('the category name should be updated to {string}', (newName) => {
    const apiResponse = Cypress.env('apiResponse');
    expect(apiResponse.body.name).to.eq(newName);
});

Then('the system should reject these invalid names with 400 Bad Request:', (table) => {
    table.hashes().forEach((row) => {
        const body = { id: 0, name: row.Name, parent: null, subCategories: [] };
        cy.apiRequest('POST', '/api/categories', body, Cypress.env('authToken')).then(res => {
            expect(res.status).to.eq(400);
        });
    });
});
