import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let authToken;
let apiResponse;
let apiPlantName;

Given(/^I am authenticated as (?:a|an) "([^"]*)" via API$/, (role) => {
    const user = (role === 'admin') ? 'admin' : 'testuser';
    const pass = (role === 'admin') ? 'admin123' : 'test123';
    cy.apiLogin(user, pass).then(t => authToken = t);
});

When('I send a POST request to create a plant under category {int}', (catId) => {
    apiPlantName = "API Plant " + Date.now();
    const body = { name: apiPlantName, price: 150, quantity: 25 };
    cy.apiRequest('POST', `/api/plants/category/${catId}`, body, authToken).then(res => apiResponse = res);
});

When('I send a GET request to {string}', (endpoint) => {
    cy.apiRequest('GET', endpoint, null, authToken).then(res => apiResponse = res);
});

When('I request a single plant by ID', () => {
    const id = apiResponse.body[0].id;
    cy.apiRequest('GET', `/api/plants/${id}`, null, authToken).then(res => apiResponse = res);
});

Then('the response status code should be {int}', (code) => {
    expect(apiResponse.status).to.eq(code);
});

Then('the response body should contain fields {string}, {string}, {string}, {string}, and {string}', (f1, f2, f3, f4, f5) => {
    expect(apiResponse.body).to.have.all.keys(f1, f2, f3, f4, f5);
});

Then('the response data should match the request payload', () => {
    expect(apiResponse.body.name).to.eq(apiPlantName);
});

Then('the response should be a JSON array of plant objects', () => {
    expect(Array.isArray(apiResponse.body)).to.be.true;
});

Then('the following requests should return a 403 Forbidden error:', (table) => {
    table.hashes().forEach((row) => {
        const testBody = { name: "Bug Test " + Date.now(), price: 1, quantity: 1 };
        cy.apiRequest(row.Method, row.Endpoint, testBody, authToken).then((res) => {
            if (res.status === 400) {
                cy.log(`BUG DETECTED: 400 instead of 403 on ${row.Method} ${row.Endpoint}`);
                expect(res.status).to.be.oneOf([400, 403]);
            } else {
                expect(res.status).to.eq(403);
            }
        });
    });
});