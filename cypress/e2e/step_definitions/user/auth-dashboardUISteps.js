import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from "../../../support/pageObjects/loginPage";

// -------------------- Given Steps --------------------
Given('I navigate to the login page', () => {
    cy.visit('/ui/login');
    cy.url().should('include', '/login');
});

Given('user is logged in as {string}', (userKey) => {
    cy.fixture("users").then((users) => {
        const creds = users[userKey];
        expect(creds, `Missing user fixture for key: ${userKey}`).to.exist;
        LoginPage.login(creds.username, creds.password);
    });
});

// -------------------- When Steps --------------------
When('I enter username {string}', (username) => {
    cy.get('input[name="username"]').clear().type(username);
});

When('I enter password {string}', (password) => {
    cy.get('input[name="password"]').clear().type(password);
});

When('I click the login button', () => {
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
});

When('I am on the Dashboard page', () => {
    cy.url().should('include', '/dashboard');
});

// -------------------- Then Steps --------------------
Then('I should be redirected to the dashboard', () => {
    cy.url().should('include', '/dashboard');
});

Then('the Dashboard page should be displayed', () => {
    cy.contains('Dashboard').should('be.visible');
});

Then('I should see validation message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

Then('I should see error message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

Then('I should remain on the login page', () => {
    cy.url().should('include', '/login');
});

Then('I should see the Categories summary card', () => {
    cy.contains('.card', 'Categories').should('be.visible');
});

Then('I should see the Plants summary card', () => {
    cy.contains('.card', 'Plants').should('be.visible');
});

Then('I should see the Sales summary card', () => {
    cy.contains('.card', 'Sales').should('be.visible');
});

Then('I should see the Inventory summary card', () => {
    cy.contains('.card', 'Inventory').should('be.visible');
});

Then('I should see the navigation menu with all links', () => {
    cy.get('nav').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Categories').should('be.visible');
    cy.contains('Plants').should('be.visible');
    cy.contains('Sales').should('be.visible');
    cy.contains('Logout').should('be.visible');
});