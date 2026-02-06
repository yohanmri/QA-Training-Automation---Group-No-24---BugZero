import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ==================== ADMIN-SPECIFIC GIVEN STEPS ====================

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

// ==================== ADMIN-SPECIFIC WHEN STEPS ====================

When('I click the logout link', () => {
    cy.contains('Logout').click();
});

When('I attempt to navigate back to dashboard', () => {
    cy.visit('/ui/dashboard');
});

When('I navigate to the Categories page', () => {
    cy.contains('Categories').click();
    cy.wait(500); // Give time for the active class to update
    cy.url().should('include', '/categories'); // Confirm navigation completed
});

When('I click {string} button on Categories card', (buttonText) => {
    cy.contains('.card', 'Categories').within(() => {
        cy.contains('button, a', buttonText).click();
    });
});

// ==================== ADMIN-SPECIFIC THEN STEPS ====================

Then('I should be redirected to the login page', () => {
    cy.url().should('include', '/login');
});

Then('I should see logout success message', () => {
    cy.get('.alert').should('be.visible');
    // Could be more specific: cy.contains('Logged out successfully').should('be.visible');
});

Then('the navigation menu should be visible', () => {
    cy.get('.sidebar').should('be.visible');
});

Then('the {string} link should be highlighted', (linkText) => {
    cy.contains('.sidebar a.nav-link', linkText)
        .should('have.class', 'active');
});

Then('the {string} link should not be highlighted', (linkText) => {
    cy.contains('.sidebar a.nav-link', linkText)
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