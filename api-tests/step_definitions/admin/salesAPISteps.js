const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { getAuthToken, setApiResponse } = require('../commonSteps');

// Shared state for sales tests
let apiResponse;
let plantId;
let qtyBefore;
let deletedSaleId;
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
function resolvePlantQuantity(plant) {
    return plant?.quantity ?? plant?.stock ?? plant?.availableQuantity;
}

function getPlants(token) {
    return cy.request({
        method: 'GET',
        url: `${baseUrl}/api/plants`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    }).then((res) => {
        expect(res.status, 'GET /api/plants status').to.equal(200);
        if (Array.isArray(res.body)) return res.body;
        if (res.body && typeof res.body === 'object') return [res.body];
        return [];
    });
}

function getPlantById(token, plantId) {
    return cy.request({
        method: 'GET',
        url: `${baseUrl}/api/plants/${plantId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    }).then((res) => {
        expect(res.status, `GET /api/plants/${plantId} status`).to.equal(200);
        return res.body;
    });
}

function findPlantWithMinStock(plants, minStock) {
    return plants.find((p) => {
        const qty = resolvePlantQuantity(p);
        return p?.id != null && typeof qty === 'number' && qty >= minStock;
    });
}

function sellPlant(token, plantId, quantity) {
    return cy.request({
        method: 'POST',
        url: `${baseUrl}/api/sales/plant/${plantId}?quantity=${quantity}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    });
}

function getSales(token) {
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
        return Array.isArray(res.body) ? res.body : [];
    });
}

function getSaleById(token, saleId) {
    return cy.request({
        method: 'GET',
        url: `${baseUrl}/api/sales/${saleId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    });
}

function getNonExistentPlantId(token) {
    return getPlants(token).then((plants) => {
        const ids = plants.map((p) => p?.id).filter((id) => id != null);
        if (ids.length === 0) return 99999999;
        const sample = ids[0];
        if (typeof sample === 'number') {
            const maxId = Math.max(...ids.filter((x) => typeof x === 'number'));
            return maxId + 999999;
        }
        return `${String(sample)}-does-not-exist`;
    });
}

function createSaleIfNone(token) {
    return getSales(token).then((sales) => {
        if (sales.length > 0 && sales[0]?.id != null) return sales[0].id;
        return getPlants(token).then((plants) => {
            const plant = findPlantWithMinStock(plants, 1);
            if (!plant) {
                throw new Error('[SETUP] No plant with stock >= 1 available to create a sale for deletion test.');
            }
            return sellPlant(token, plant.id, 1).then((sellRes) => {
                expect(sellRes.status, 'seed sale status').to.equal(201);
                expect(sellRes.body?.id, 'seed sale id').to.exist;
                return sellRes.body.id;
            });
        });
    });
}

// Step Definitions

/* TC_SALES_API_ADMIN_01 */
When('I sell an existing plant with quantity {int}', (quantity) => {
    cy.then(() => {
        const token = getAuthToken();

        return getPlants(token).then((plants) => {
            const plant = findPlantWithMinStock(plants, 1);
            if (!plant) throw new Error('[SETUP] No plant with stock >= 1 found for selling.');

            return sellPlant(token, plant.id, quantity).then(saveResponse);
        });
    });
});

/* TC_SALES_API_ADMIN_02 */
When('I sell a plant with stock at least {int} with quantity {int}', (minStock, quantity) => {
    cy.then(() => {
        const token = getAuthToken();

        return getPlants(token).then((plants) => {
            const plant = findPlantWithMinStock(plants, minStock);
            if (!plant) throw new Error(`[SETUP] No plant with stock >= ${minStock} found. Seed data and re-run.`);

            plantId = plant.id;

            return getPlantById(token, plant.id).then((beforePlant) => {
                qtyBefore = resolvePlantQuantity(beforePlant);

                return sellPlant(token, plant.id, quantity).then(saveResponse);
            });
        });
    });
});

/* TC_SALES_API_ADMIN_04 */
When('I sell a non-existent plant with quantity {int}', (quantity) => {
    cy.then(() => {
        const token = getAuthToken();

        return getNonExistentPlantId(token).then((badId) => {
            return sellPlant(token, badId, quantity).then(saveResponse);
        });
    });
});

/* TC_SALES_API_ADMIN_05 */
When('I delete an existing sale', () => {
    cy.then(() => {
        const token = getAuthToken();

        return createSaleIfNone(token).then((saleId) => {
            deletedSaleId = saleId;

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

/* TC_SALES_API_ADMIN_09 */
When('I attempt to sell an existing plant without authentication with quantity {int}', (quantity) => {
    cy.then(() => {
        const token = getAuthToken();

        return getPlants(token).then((plants) => {
            const plant = findPlantWithMinStock(plants, 1);
            if (!plant) throw new Error('[SETUP] No plant with stock >= 1 found.');

            // Send request WITHOUT token
            return cy.request({
                method: 'POST',
                url: `${baseUrl}/api/sales/plant/${plant.id}?quantity=${quantity}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }).then(saveResponse);
        });
    });
});

/* TC_SALES_API_ADMIN_10 */
When('I attempt to delete an existing sale without authentication', () => {
    cy.then(() => {
        const token = getAuthToken();

        return createSaleIfNone(token).then((saleId) => {
            // Send request WITHOUT token
            return cy.request({
                method: 'DELETE',
                url: `${baseUrl}/api/sales/${saleId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }).then(saveResponse);
        });
    });
});

/* TC_SALES_API_ADMIN_11 */
When('I sell a plant with its full stock', () => {
    cy.then(() => {
        const token = getAuthToken();

        return getPlants(token).then((plants) => {
            const plant = findPlantWithMinStock(plants, 1);
            if (!plant) throw new Error('[SETUP] No plant with stock >= 1 found for full-stock sale.');

            plantId = plant.id;

            return getPlantById(token, plant.id).then((beforePlant) => {
                const qty = resolvePlantQuantity(beforePlant);
                expect(qty, 'Plant stock should be > 0').to.be.greaterThan(0);

                qtyBefore = qty;

                return sellPlant(token, plant.id, qty).then(saveResponse);
            });
        });
    });
});

/* Admin-only Thens */
Then('the response should be a Sale object with quantity {int}', (expectedQty) => {
    expect(apiResponse.headers['content-type']).to.include('application/json');
    expect(apiResponse.body).to.have.property('id');
    expect(apiResponse.body).to.have.property('quantity');
    expect(apiResponse.body).to.have.property('soldAt');
    expect(apiResponse.body.quantity).to.equal(expectedQty);

    cy.log(`✅ Sale created with quantity: ${apiResponse.body.quantity}`);
});

Then('the plant stock should be reduced by 1', () => {
    cy.then(() => {
        const token = getAuthToken();

        return getPlantById(token, plantId).then((afterPlant) => {
            const qtyAfter = resolvePlantQuantity(afterPlant);
            expect(qtyAfter).to.equal(qtyBefore - 1);
            cy.log(`✅ Plant stock reduced from ${qtyBefore} to ${qtyAfter}`);
        });
    });
});

Then('the deleted sale should not be retrievable', () => {
    cy.then(() => {
        const token = getAuthToken();

        return getSaleById(token, deletedSaleId).then((res) => {
            expect(res.status).to.equal(404);
            cy.log(`✅ Deleted sale ${deletedSaleId} is no longer retrievable`);
        });
    });
});

Then('the plant quantity should be 0 after selling all stock', () => {
    cy.then(() => {
        const token = getAuthToken();

        return getPlantById(token, plantId).then((afterPlant) => {
            const qtyAfter = resolvePlantQuantity(afterPlant);
            expect(qtyAfter).to.equal(0);
            cy.log(`✅ Plant stock is now 0 after selling all ${qtyBefore} units`);
        });
    });
});

// Export for use in other step definition files
module.exports = {
    getApiResponse: () => apiResponse
};
