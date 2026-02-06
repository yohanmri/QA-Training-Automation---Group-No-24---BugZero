const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { getAuthToken, getApiResponse } = require('../commonSteps');

let localApiResponse;
let baseUrl = 'http://localhost:8080';

// Helper to save response
function saveResponse(response) {
    localApiResponse = response;
    cy.log(`Response Status: ${response.status}`);
    if (response.body) {
        cy.log(`Response Body: ${JSON.stringify(response.body)}`);
    }
}

// Helper functions
function getAnyPlantId(token) {
    return cy.request({
        method: 'GET',
        url: `${baseUrl}/api/plants`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    }).then((res) => {
        if (res.status !== 200) {
            throw new Error(`[SETUP] Expected 200 from GET /api/plants but got ${res.status}. Body: ${JSON.stringify(res.body)}`);
        }
        const body = res.body;
        if (Array.isArray(body) && body.length > 0 && body[0]?.id != null) return body[0].id;
        if (body && typeof body === 'object' && body.id != null) return body.id;
        throw new Error(`[SETUP] Could not resolve a plantId from GET /api/plants response: ${JSON.stringify(body)}`);
    });
}

function getAnySaleIdOrSeed(userToken) {
    return cy.request({
        method: 'GET',
        url: `${baseUrl}/api/sales`,
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    }).then((res) => {
        if (res.status !== 200) {
            throw new Error(`[SETUP] Expected 200 from GET /api/sales but got ${res.status}. Body: ${JSON.stringify(res.body)}`);
        }
        // if any sales exist then use first id
        if (Array.isArray(res.body) && res.body.length > 0 && res.body[0]?.id != null) {
            return res.body[0].id;
        }
        // If no sales exist, we'll just return null and let the test fail appropriately
        throw new Error('[SETUP] No sales exist to test DELETE. Please seed sales data in DB.');
    });
}

// Step Definitions

When('I request paged sales with page {int} and size {int} and sort {string}', (page, size, sort) => {
    const token = getAuthToken();

    cy.request({
        method: 'GET',
        url: `${baseUrl}/api/sales/page?page=${page}&size=${size}&sort=${sort}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    }).then(saveResponse);
});

When('I attempt to sell any available plant with quantity {int}', (quantity) => {
    const token = getAuthToken();

    getAnyPlantId(token).then((plantId) => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/sales/plant/${plantId}?quantity=${quantity}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        }).then(saveResponse);
    });
});

When('I attempt to delete any existing sale', () => {
    const token = getAuthToken();

    getAnySaleIdOrSeed(token).then((saleId) => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/api/sales/${saleId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        }).then(saveResponse);
    });
});

Then('the response should be a JSON array of Sale objects', () => {
    // Use getApiResponse() to get response from commonSteps (for TC_SALES_API_USER_01)
    const apiResponse = getApiResponse();

    expect(apiResponse.headers).to.have.property('content-type');
    expect(apiResponse.headers['content-type']).to.include('application/json');
    expect(apiResponse.body).to.be.an('array');

    // Validate each sale object has expected properties
    apiResponse.body.forEach((sale) => {
        expect(sale).to.have.property('id');
        expect(sale).to.have.property('quantity');
        expect(sale).to.have.property('soldAt');
    });

    cy.log(`✅ Retrieved ${apiResponse.body.length} sales`);
});

Then('the response should match the PageSale schema with max page size {int}', (maxSize) => {
    // Use localApiResponse for paged sales (set by When step in this file)
    const apiResponse = localApiResponse;

    expect(apiResponse.headers['content-type']).to.include('application/json');

    // Validate page structure
    expect(apiResponse.body).to.have.property('content');
    expect(apiResponse.body).to.have.property('totalElements');
    expect(apiResponse.body).to.have.property('totalPages');
    expect(apiResponse.body).to.have.property('size');
    expect(apiResponse.body).to.have.property('number');

    expect(apiResponse.body.content).to.be.an('array');
    expect(apiResponse.body.content.length).to.be.at.most(maxSize);

    // Validate each sale in content
    apiResponse.body.content.forEach((sale) => {
        expect(sale).to.have.property('id');
        expect(sale).to.have.property('quantity');
        expect(sale).to.have.property('soldAt');
    });

    // Validate sorting (soldAt desc)
    const dates = apiResponse.body.content.map((s) => new Date(s.soldAt).getTime());
    for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).to.be.at.most(dates[i - 1]);
    }

    cy.log(`✅ Page contains ${apiResponse.body.content.length} sales, sorted by soldAt desc`);
});

Then('the response should contain an authorization error message', () => {
    // Use localApiResponse for authorization tests (set by When steps in this file)
    const apiResponse = localApiResponse;

    // Check for common authorization error patterns
    if (apiResponse.body && typeof apiResponse.body === 'object') {
        if ('message' in apiResponse.body) {
            const message = String(apiResponse.body.message).toLowerCase();
            expect(message).to.satisfy((msg) =>
                msg.includes('forbidden') ||
                msg.includes('access denied') ||
                msg.includes('not authorized'),
                'Response should contain authorization error message'
            );
            cy.log(`✅ Authorization error: ${apiResponse.body.message}`);
            return;
        }
        if ('error' in apiResponse.body) {
            const error = String(apiResponse.body.error).toLowerCase();
            expect(error).to.include('forbidden');
            cy.log(`✅ Authorization error: ${apiResponse.body.error}`);
            return;
        }
    }

    // Ensure it's not a successful sale response
    expect(apiResponse.body).to.not.have.property('soldAt');
    cy.log(`✅ Request was rejected (no sale data in response)`);
});

// Export for use in other step definition files
module.exports = {
    getLocalApiResponse: () => localApiResponse
};
