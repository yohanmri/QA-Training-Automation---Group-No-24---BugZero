import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import { setApiResponse } from "../common/apiAssertions";

let authToken;
let apiPlantName;

function randomLetters(len = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// --- Admin API Authentication ---
Given(/^I am authenticated as (?:a|an) "admin" via API$/, () => {
    cy.apiLogin('admin', 'admin123').then(t => authToken = t);
});

// --- Admin Creation Actions ---
When('I send a POST request to create a plant under category {int}', (catId) => {
    apiPlantName = "APIPlant" + randomLetters();
    const body = { name: apiPlantName, price: 25.50, quantity: 10 };
    cy.apiRequest('POST', `/api/plants/category/${catId}`, body, authToken).then(res => {
        setApiResponse(res);
    });
});
