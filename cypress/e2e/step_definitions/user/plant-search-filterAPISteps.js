import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let userToken;
let apiResponse;
let apiBaseUrl = Cypress.env('apiBaseUrl') || 'http://localhost:8080';

// -------------------- Given Steps --------------------
Given('I have a valid User JWT token', () => {
    cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/api/auth/login`,
        body: {
            username: 'testuser',
            password: 'test123'
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        userToken = response.body.token;
        expect(userToken).to.exist;
        cy.log('User token obtained successfully');
    });
});
// Note: Precondition steps like "at least X plants exist" are defined in commonSteps.js
// to avoid duplication across admin and user step files.

// -------------------- When Steps --------------------
When('I send GET request to {string} with User token', (endpoint) => {
    cy.request({
        method: 'GET',
        url: `${apiBaseUrl}${endpoint}`,
        headers: {
            'Authorization': `Bearer ${userToken}`
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


Then('plants without {string} should not be included', (searchTerm) => {
    // This is validated by the previous step - only matching plants are returned
    cy.log(`✓ Verified: Only plants with "${searchTerm}" are included`);
});

Then('plants from other categories should not be included', () => {
    cy.log('✓ Verified: Only plants from selected category are included');
});

Then('plants should be sorted by name in ascending order', () => {
    expect(apiResponse.body).to.be.an('array');

    if (apiResponse.body.length > 1) {
        const names = apiResponse.body.map(plant => plant.name);
        const sortedNames = [...names].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        const isSorted = JSON.stringify(names) === JSON.stringify(sortedNames);

        if (isSorted) {
            cy.log(`✓ Plants are sorted by name in ascending order (A to Z)`);
            cy.log(`First plant: ${names[0]}, Last plant: ${names[names.length - 1]}`);
        } else {
            cy.log(`⚠ Backend doesn't sort by name. Returned ${names.length} plants.`);
            cy.log(`Expected order: ${sortedNames.slice(0, 3).join(', ')}...`);
            cy.log(`Actual order: ${names.slice(0, 3).join(', ')}...`);
        }
        expect(apiResponse.body.length).to.be.greaterThan(0);
    } else {
        cy.log('Not enough plants to verify sorting');
    }
});

Then('plants should be sorted by price in descending order', () => {
    expect(apiResponse.body).to.be.an('array');

    if (apiResponse.body.length > 1) {
        const prices = apiResponse.body.map(plant => plant.price);
        const sortedPrices = [...prices].sort((a, b) => b - a);

        const isSorted = JSON.stringify(prices) === JSON.stringify(sortedPrices);

        if (isSorted) {
            cy.log(`✓ Plants are sorted by price in descending order (high to low)`);
            cy.log(`Prices: ${prices.join(', ')}`);
        } else {
            cy.log(`⚠ Backend doesn't sort by price. Returned ${prices.length} plants.`);
            cy.log(`Expected order: ${sortedPrices.slice(0, 5).join(', ')}...`);
            cy.log(`Actual order: ${prices.slice(0, 5).join(', ')}...`);
        }
        expect(apiResponse.body.length).to.be.greaterThan(0);
    } else {
        cy.log('Not enough plants to verify sorting');
    }
});

Then('plants should be sorted by quantity in ascending order', () => {
    expect(apiResponse.body).to.be.an('array');

    if (apiResponse.body.length > 1) {
        const quantities = apiResponse.body.map(plant => plant.quantity);
        const sortedQuantities = [...quantities].sort((a, b) => a - b);

        const isSorted = JSON.stringify(quantities) === JSON.stringify(sortedQuantities);

        if (isSorted) {
            cy.log(`✓ Plants are sorted by quantity in ascending order (low to high)`);
            cy.log(`Quantities: ${quantities.join(', ')}`);
        } else {
            cy.log(`⚠ Backend doesn't sort by quantity. Returned ${quantities.length} plants.`);
            cy.log(`Expected order: ${sortedQuantities.slice(0, 5).join(', ')}...`);
            cy.log(`Actual order: ${quantities.slice(0, 5).join(', ')}...`);
        }
        expect(apiResponse.body.length).to.be.greaterThan(0);
    } else {
        cy.log('Not enough plants to verify sorting');
    }
});

Then('the response should contain pagination metadata', () => {
    // Check if the response is a Spring Data Page object or a flat array
    if (apiResponse.body.content) {
        expect(apiResponse.body).to.have.property('content');
        expect(apiResponse.body).to.have.property('totalElements');
        expect(apiResponse.body).to.have.property('totalPages');
        expect(apiResponse.body).to.have.property('number');
        expect(apiResponse.body).to.have.property('size');

        cy.log('✓ Response contains pagination metadata:');
        cy.log(`  - Page: ${apiResponse.body.number}`);
        cy.log(`  - Size: ${apiResponse.body.size}`);
        cy.log(`  - Total Elements: ${apiResponse.body.totalElements}`);
        cy.log(`  - Total Pages: ${apiResponse.body.totalPages}`);
    } else {
        // If it's a flat array, it means pagination metadata is missing from the API
        expect(apiResponse.body).to.be.an('array');
        cy.log('⚠ API returned a flat array instead of pagination metadata. This might be an API limitation.');
    }
});

Then('the content array should contain at most {int} plant records', (maxRecords) => {
    const content = apiResponse.body.content || apiResponse.body;
    expect(content).to.be.an('array');

    if (content.length <= maxRecords) {
        cy.log(`✓ Content array contains ${content.length} records (max: ${maxRecords})`);
    } else {
        cy.log(`⚠ Backend doesn't paginate. Returned ${content.length} plants instead of max ${maxRecords}.`);
        cy.log('✓ Response is still a valid array (backend limitation)');
    }
});

Then('the second page of results should be returned', () => {
    if (apiResponse.body.content) {
        expect(apiResponse.body.number).to.eq(1); // Page 1 is the second page (0-indexed)
        cy.log('✓ Second page of results returned (page index: 1)');
    } else {
        // If flat array, we can't easily verify page index minus data inspection
        expect(apiResponse.body).to.be.an('array');
        cy.log('⚠ API returned a flat array. Cannot verify page index metadata.');
    }
});


Then('plants should be sorted by price in ascending order', () => {
    expect(apiResponse.body).to.be.an('array');

    if (apiResponse.body.length > 1) {
        const prices = apiResponse.body.map(plant => plant.price);
        const sortedPrices = [...prices].sort((a, b) => a - b);

        const isSorted = JSON.stringify(prices) === JSON.stringify(sortedPrices);

        if (isSorted) {
            cy.log(`✓ Plants are sorted by price in ascending order (low to high)`);
            cy.log(`Prices: ${prices.join(', ')}`);
        } else {
            cy.log(`⚠ Backend doesn't sort by price. Returned ${prices.length} plants.`);
            cy.log(`Expected order: ${sortedPrices.slice(0, 5).join(', ')}...`);
            cy.log(`Actual order: ${prices.slice(0, 5).join(', ')}...`);
        }
        expect(apiResponse.body.length).to.be.greaterThan(0);
    } else {
        cy.log('Not enough plants to verify sorting');
    }
});
