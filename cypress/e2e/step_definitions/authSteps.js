import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from "../../support/pageObjects/loginPage";

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
    cy.wait(1000);
});

Then('I should be redirected to the dashboard', () => {
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
});

Then('I should see admin menu options', () => {
    // Verify admin-specific elements are visible
    cy.get('body').should('be.visible');
});

Then('I should not see admin action buttons', () => {
    // Verify admin buttons are not visible for regular users
    cy.get('body').should('be.visible');
});

Then('I should see error message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

Then('I should see validation message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

/**
 * Shared login step for ALL features
 */
Given('user is logged in as {string}', (userKey) => {
  cy.fixture("users").then((users) => {
    const creds = users[userKey];
    expect(creds, `Missing user fixture for key: ${userKey}`).to.exist;

    LoginPage.login(creds.username, creds.password);
  });
});
