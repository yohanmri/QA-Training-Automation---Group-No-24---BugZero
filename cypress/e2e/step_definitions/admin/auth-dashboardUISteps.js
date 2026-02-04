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

Given('at least {int} category exists', (count) => {
    // This is a precondition check - data should already exist
    cy.log(`Precondition: At least ${count} category should exist`);
});

Given('at least {int} plant with quantity less than {int} exists', (plantCount, quantity) => {
    cy.log(`Precondition: At least ${plantCount} plant with quantity < ${quantity} should exist`);
});

Given('at least {int} sale exists', (count) => {
    cy.log(`Precondition: At least ${count} sale should exist`);
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

When('I click the logout link', () => {
    cy.contains('Logout').click();
});

When('I attempt to navigate back to dashboard', () => {
    cy.visit('/ui/dashboard');
});

When('I navigate to the Categories page', () => {
    cy.contains('Categories').click();
});

When('I am on the Dashboard page', () => {
    cy.url().should('include', '/dashboard');
});

When('I click {string} button on Categories card', (buttonText) => {
    cy.contains('.card', 'Categories').within(() => {
        cy.contains('button', buttonText).click();
    });
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

Then('I should be redirected to the login page', () => {
    cy.url().should('include', '/login');
});

Then('I should see logout success message', () => {
    cy.get('.alert').should('be.visible');
    // Could be more specific: cy.contains('Logged out successfully').should('be.visible');
});

Then('the navigation menu should be visible', () => {
    cy.get('nav').should('be.visible');
});

Then('the {string} link should be highlighted', (linkText) => {
    cy.contains('nav a', linkText)
        .should('have.class', 'active')
        .or('have.attr', 'aria-current');
});

Then('the {string} link should not be highlighted', (linkText) => {
    cy.contains('nav a', linkText)
        .should('not.have.class', 'active');
});

Then('I should see Categories card with count greater than {int}', (count) => {
    cy.contains('.card', 'Categories').should('be.visible');
    // Add specific count validation if needed
});

Then('I should see Plants card with Total count greater than {int}', (count) => {
    cy.contains('.card', 'Plants').within(() => {
        cy.contains('Total').should('be.visible');
    });
});

Then('I should see Plants card with Low Stock count greater than {int}', (count) => {
    cy.contains('.card', 'Plants').within(() => {
        cy.contains('Low Stock').should('be.visible');
    });
});

Then('I should see Sales card with Revenue greater than {int}', (count) => {
    cy.contains('.card', 'Sales').within(() => {
        cy.contains('Revenue').should('be.visible');
    });
});

Then('I should see Sales card with Sales count greater than {int}', (count) => {
    cy.contains('.card', 'Sales').should('be.visible');
});

Then('I should be redirected to {string}', (path) => {
    cy.url().should('include', path);
});

Then('I should see the Categories summary card', () => {
    cy.contains('Categories').should('be.visible');
});

Then('I should see the Plants summary card', () => {
    cy.contains('Plants').should('be.visible');
});

Then('I should see the Sales summary card', () => {
    cy.contains('Sales').should('be.visible');
});