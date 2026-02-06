import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- BACKGROUND LOGIN STEPS (REQUIRED FOR FEATURES TO RUN) ---

Given("the admin is logged into the application", () => {
    // This calls the shortcut in your commands.js
    cy.loginAsAdmin(); 
});

Given("the user is logged into the application", () => {
    // This calls the shortcut in your commands.js
    cy.loginAsUser();
});

// --- EXISTING MANUAL LOGIN STEPS ---

Given('I navigate to the login page', () => {
    cy.visit('/ui/login');
    cy.url().should('include', '/login');
});

When('I enter username {string}', (username) => {
    cy.get('input[name="username"]').clear().type(username);
});

When('I enter password {string}', (password) => {
    cy.get('input[name="password"]').clear().type(password);
});

When('I click the login button', () => {
    cy.get('button[type="submit"]').click();
});

Then('I should be redirected to the dashboard', () => {
    cy.url().should('match', /dashboard|plants|categories/);
});

Then('I should see admin menu options', () => {
    cy.contains('Add').should('be.visible');
});

Then('I should not see admin action buttons', () => {
    cy.contains('Add').should('not.exist');
});

Then('I should see error message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

Then('I should see validation message {string}', (message) => {
    cy.contains(message).should('be.visible');
});