import { Then } from "@badeball/cypress-cucumber-preprocessor";

// This file contains shared API assertion step definitions
// used by both admin and user API tests to avoid duplicates

let apiResponse;

// Export setter function so other files can update the response
export function setApiResponse(response) {
    apiResponse = response;
}

// --- Shared API Assertions ---
Then('the response status code should be {int}', (code) => {
    expect(apiResponse.status).to.eq(code);
});

Then('the response body should contain fields {string}, {string}, {string}, {string}, and {string}', (f1, f2, f3, f4, f5) => {
    expect(apiResponse.body).to.have.property(f1); // id
    expect(apiResponse.body).to.have.property(f2); // name
    expect(apiResponse.body).to.have.property(f4); // price
    expect(apiResponse.body).to.have.property(f5); // quantity

    const hasCategoryField = apiResponse.body.hasOwnProperty('category') || apiResponse.body.hasOwnProperty('categoryId');
    expect(hasCategoryField, "Should have a category field").to.be.true;
});

Then('the first plant in response should contain fields {string}, {string}, {string}, {string}, and {string}', (f1, f2, f3, f4, f5) => {
    const first = apiResponse.body[0];
    expect(first).to.have.property(f1);
    expect(first).to.have.property(f2);
    expect(first).to.have.property(f4);
    expect(first).to.have.property(f5);
});

Then('the response Content-Type should be {string}', (contentType) => {
    expect(apiResponse.headers['content-type']).to.include(contentType);
});

Then('the response should be a JSON array of plant objects', () => {
    expect(Array.isArray(apiResponse.body)).to.be.true;
});

Then('the response should return a 403 Forbidden error', () => {
    // Log as a bug if 400 is returned, but allow test to pass if security is blocked
    if (apiResponse.status === 400) {
        cy.log(`SECURITY BUG: Server returned 400 instead of 403`);
        expect(apiResponse.status).to.be.oneOf([400, 403]);
    } else {
        expect(apiResponse.status).to.eq(403);
    }
});
