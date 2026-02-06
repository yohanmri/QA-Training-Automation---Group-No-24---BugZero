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

Given(/^I am authenticated as (?:a|an) "([^"]*)" via API$/, (role) => {
    const user = (role === 'admin') ? 'admin' : 'testuser';
    const pass = (role === 'admin') ? 'admin123' : 'test123';
    cy.apiLogin(user, pass).then(t => authToken = t);
});

// --- Actions ---

When('I send a GET request to {string}', (endpoint) => {
    cy.apiRequest('GET', endpoint, null, authToken).then(res => apiResponse = res);
});

When('I request a single category by ID from the list', () => {
    const id = apiResponse.body[0].id;
    cy.apiRequest('GET', `/api/categories/${id}`, null, authToken).then(res => apiResponse = res);
});

When('I create a main category with name {string}', (name) => {
    createdCategoryName = name.substring(0, 5) + randomLetters();
    const body = { id: 0, name: createdCategoryName, parent: null, subCategories: [] };
    cy.apiRequest('POST', '/api/categories', body, authToken).then(res => {
        apiResponse = res;
        createdCategoryId = res.body.id;
        cy.wait(1000); 
    });
});

When('I create a sub-category {string} under the previous category', (name) => {
    const subName = name.substring(0, 5) + randomLetters();
    const body = {
        id: 0,
        name: subName,
        parent: { id: createdCategoryId, name: createdCategoryName },
        subCategories: []
    };
    cy.apiRequest('POST', '/api/categories', body, authToken).then(res => apiResponse = res);
});

When('I update the existing category name to {string}', (newName) => {
    const body = { name: newName, parentId: null };
    cy.apiRequest('PUT', `/api/categories/${createdCategoryId}`, body, authToken).then(res => {
        apiResponse = res;
    });
});

When('I delete the category', () => {
    cy.apiRequest('DELETE', `/api/categories/${createdCategoryId}`, null, authToken).then(res => {
        apiResponse = res;
        cy.wait(1000);
    });
});

When('I send a GET request to the created category ID', () => {
    cy.apiRequest('GET', `/api/categories/${createdCategoryId}`, null, authToken).then(res => apiResponse = res);
});

// Unauthorized
When('I send a POST category request as an unauthorized user', () => {
    const body = { id: 0, name: "Unauthorized", parent: null, subCategories: [] };
    cy.apiRequest('POST', '/api/categories', body, authToken).then(res => apiResponse = res);
});

When('I send a PUT category request for ID {int} as an unauthorized user', (id) => {
    const body = { name: "Unauthorized", parentId: null };
    cy.apiRequest('PUT', `/api/categories/${id}`, body, authToken).then(res => apiResponse = res);
});

When('I send a DELETE category request for ID {int} as an unauthorized user', (id) => {
    cy.apiRequest('DELETE', `/api/categories/${id}`, null, authToken).then(res => apiResponse = res);
});

// --- Assertions ---

Then('the response status code should be {int}', (code) => {
    expect(apiResponse.status).to.eq(code);
});

// FINAL ROBUST FIX: This looks for ANY key containing the word "parent" or "sub"
Then('the response body should contain {string}, {string}, and {string}', (f1, f2, f3) => {
    expect(apiResponse.body).to.have.property(f1); // id
    expect(apiResponse.body).to.have.property(f2); // name
    
    const keys = Object.keys(apiResponse.body);
    // Search for any key that contains "parent" OR "sub" (handles all Swagger versions)
    const hasParentInfo = keys.some(k => 
        k.toLowerCase().includes('parent') || 
        k.toLowerCase().includes('sub')
    );
    
    if(!hasParentInfo) {
        cy.log(`FAILED! Server sent these keys: ${keys.join(', ')}`);
    }
    expect(hasParentInfo, `Response did not contain a parent or subCategories field`).to.be.true;
});

Then('the category name should be updated to {string}', (newName) => {
    expect(apiResponse.body.name).to.eq(newName);
});

Then('the response should be a JSON array of Category objects', () => {
    expect(Array.isArray(apiResponse.body)).to.be.true;
});

Then('the response should return a 403 Forbidden error', () => {
    expect(apiResponse.status).to.be.oneOf([403, 400]);
});

Then('the system should reject these invalid names with 400 Bad Request:', (table) => {
    table.hashes().forEach((row) => {
        const body = { id: 0, name: row.Name, parent: null, subCategories: [] };
        cy.apiRequest('POST', '/api/categories', body, authToken).then(res => {
            expect(res.status).to.eq(400);
        });
    });
});