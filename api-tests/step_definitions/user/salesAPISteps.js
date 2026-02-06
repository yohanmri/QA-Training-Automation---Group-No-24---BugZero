const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { getAuthToken, setApiResponse } = require('../commonSteps');

// Shared state for sales tests
let apiResponse;
let baseUrl = 'http://localhost:8080';

// Helper to save response
function saveResponse(response) {
    apiResponse = response;
    setApiResponse(response);  // Update the shared state in commonSteps
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

function getNonExistentSaleId(token) {
    return cy.request({
        method: 'GET',
        url: `${baseUrl}/api/sales`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    }).then((res) => {
        expect(res.status, 'GET /api/sales status').to.equal(200);
        const ids = (Array.isArray(res.body) ? res.body : [])
            .map((s) => s?.id)
            .filter((id) => typeof id === 'number');
        if (ids.length === 0) return 99999999;
        const maxId = Math.max(...ids);
        return maxId + 999999;
    });
}

// Step Definitions

/* TC_SALES_API_USER_01 */
When('I request all sales', () => {
    cy.then(() => {
        const token = getAuthToken();

        return cy.request({
            method: 'GET',
            url: `${baseUrl}/api/sales`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        }).then(saveResponse);
    });
});

/* TC_SALES_API_USER_02 */
When('I request paged sales with page {int} and size {int} and sort {string}', (page, size, sort) => {
    cy.then(() => {
        const token = getAuthToken();

        return cy.request({
            method: 'GET',
            url: `${baseUrl}/api/sales/page?page=${page}&size=${size}&sort=${sort}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        }).then(saveResponse);
    });
});

/* TC_SALES_API_USER_03 */
When('I request all sales without authentication', () => {
    cy.request({
        method: 'GET',
        url: `${baseUrl}/api/sales`,
        headers: {
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    }).then(saveResponse);
});

/* TC_SALES_API_USER_04 */
When('I attempt to sell any available plant with quantity {int}', (quantity) => {
    cy.then(() => {
        const token = getAuthToken();

        return getAnyPlantId(token).then((plantId) => {
            return cy.request({
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
});

/* TC_SALES_API_USER_05 */
When('I attempt to delete any existing sale', () => {
    cy.then(() => {
        const token = getAuthToken();

        return getAnySaleIdOrSeed(token).then((saleId) => {
            return cy.request({
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
});

/* TC_SALES_API_USER_09 */
When('I request a sale by a non-existent id', () => {
    cy.then(() => {
        const token = getAuthToken();

        return getNonExistentSaleId(token).then((saleId) => {
            return cy.request({
                method: 'GET',
                url: `${baseUrl}/api/sales/${saleId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }).then(saveResponse);
        });
    });
});

/* User-specific Then steps */
Then('the response should be a JSON array of Sale objects', () => {
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

Then('each Sale in the response should have correct totalPrice', () => {
    expect(apiResponse.status).to.equal(200);
    expect(apiResponse.body).to.be.an('array');
    expect(apiResponse.body.length, 'Expected at least 1 sale record for totalPrice validation').to.be.greaterThan(0);

    apiResponse.body.forEach((sale) => {
        // Validate sale shape
        expect(sale).to.have.property('id');
        expect(sale).to.have.property('quantity');
        expect(sale).to.have.property('soldAt');
        expect(sale).to.have.property('plant');
        expect(sale).to.have.property('totalPrice');

        const price = Number(sale.plant.price);
        const qty = Number(sale.quantity);
        const total = Number(sale.totalPrice);

        const expected = price * qty;

        // allow tiny floating precision tolerance
        expect(total, `totalPrice for saleId=${sale.id}`).to.be.closeTo(expected, 0.0001);
    });

    cy.log(`✅ All ${apiResponse.body.length} sales have correct totalPrice calculation`);
});

// Export for use in other step definition files
module.exports = {
    getApiResponse: () => apiResponse
};
