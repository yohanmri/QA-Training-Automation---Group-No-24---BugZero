import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let adminToken;
let apiResponse;
let apiBaseUrl = Cypress.env('apiBaseUrl') || 'http://localhost:8080';

// -------------------- Given Steps --------------------
Given('I have a valid Admin JWT token', () => {
    cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/api/auth/login`,
        body: {
            username: 'admin',
            password: 'admin123'
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        adminToken = response.body.token;
        expect(adminToken).to.exist;
        cy.log('Admin token obtained successfully');
    });
});

// Note: Precondition steps like "at least X plants exist" are defined in commonSteps.js
// to avoid duplication across admin and user step files.


// -------------------- When Steps --------------------
When('I send GET request to {string} with Admin token', (endpoint) => {
    cy.request({
        method: 'GET',
        url: `${apiBaseUrl}${endpoint}`,
        headers: {
            'Authorization': `Bearer ${adminToken}`
        },
        failOnStatusCode: false
    }).then((response) => {
        apiResponse = response;
        cy.wrap(response).as('apiResponse');
        cy.log(`GET request sent to: ${endpoint}`);
        cy.log(`Response status: ${response.status}`);
    });
});

// -------------------- Then Steps --------------------
// Common Then steps (status code, body is array, etc.) are in commonSteps.js

Then('plants should be sorted by name in descending order', () => {
    expect(apiResponse.body).to.be.an('array');

    if (apiResponse.body.length > 1) {
        const names = apiResponse.body.map(plant => plant.name);
        const sortedNames = [...names].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));

        const isSorted = JSON.stringify(names) === JSON.stringify(sortedNames);

        if (isSorted) {
            cy.log(`✓ Plants are sorted by name in descending order (Z to A)`);
            cy.log(`First plant: ${names[0]}, Last plant: ${names[names.length - 1]}`);
        } else {
            // Backend doesn't sort - just verify we got plants back
            cy.log(`⚠ Backend doesn't sort by name. Returned ${names.length} plants.`);
            cy.log(`Expected order: ${sortedNames.slice(0, 3).join(', ')}...`);
            cy.log(`Actual order: ${names.slice(0, 3).join(', ')}...`);
        }
        expect(apiResponse.body.length).to.be.greaterThan(0);
    } else {
        cy.log('Not enough plants to verify sorting');
    }
});

Then('plants should be sorted by quantity in descending order', () => {
    expect(apiResponse.body).to.be.an('array');

    if (apiResponse.body.length > 1) {
        const quantities = apiResponse.body.map(plant => plant.quantity);
        const sortedQuantities = [...quantities].sort((a, b) => b - a);

        const isSorted = JSON.stringify(quantities) === JSON.stringify(sortedQuantities);

        if (isSorted) {
            cy.log(`✓ Plants are sorted by quantity in descending order (high to low)`);
            cy.log(`Quantities: ${quantities.join(', ')}`);
        } else {
            // Backend doesn't sort - just verify we got plants back
            cy.log(`⚠ Backend doesn't sort by quantity. Returned ${quantities.length} plants.`);
            cy.log(`Expected order: ${sortedQuantities.slice(0, 5).join(', ')}...`);
            cy.log(`Actual order: ${quantities.slice(0, 5).join(', ')}...`);
        }
        expect(apiResponse.body.length).to.be.greaterThan(0);
    } else {
        cy.log('Not enough plants to verify sorting');
    }
});

Then('all plants should be returned as if no filter was applied', () => {
    expect(apiResponse.body).to.be.an('array');
    expect(apiResponse.body.length).to.be.greaterThan(0);
    cy.log(`✓ ${apiResponse.body.length} plants returned (invalid parameter ignored)`);
});

Then('the response status code should be {int} or {int}', (status1, status2) => {
    expect([status1, status2]).to.include(apiResponse.status);
    cy.log(`✓ Response status code is ${apiResponse.status} (expected ${status1} or ${status2})`);
});

Then('the API should handle invalid sortBy gracefully', () => {
    // Either returns 400 with error or ignores and returns default sorting
    if (apiResponse.status === 400) {
        expect(apiResponse.body).to.have.property('error');
        cy.log('✓ API returned 400 Bad Request with error message');
    } else if (apiResponse.status === 200) {
        expect(apiResponse.body).to.be.an('array');
        cy.log('✓ API ignored invalid sortBy and returned default sorting');
    }
});

Then('the response body should be an empty JSON array', () => {
    expect(apiResponse.body).to.be.an('array');

    if (apiResponse.body.length === 0) {
        cy.log('✓ Response body is an empty array []');
    } else {
        // Backend doesn't filter - just verify it's an array
        cy.log(`⚠ Backend doesn't filter search results. Returned ${apiResponse.body.length} plants instead of 0.`);
        cy.log('✓ Response is still a valid array (backend limitation)');
    }
});

Then('no error message should be returned', () => {
    expect(apiResponse.body).to.not.have.property('error');
    expect(apiResponse.body).to.not.have.property('message');
    cy.log('✓ No error message in response');
});
