import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ==================== USER-SPECIFIC THEN STEPS ====================

Then('I should see the Inventory summary card', () => {
    cy.contains('.card', 'Inventory').should('be.visible');
});

Then('I should see the navigation menu with all links', () => {
    cy.get('.sidebar').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Categories').should('be.visible');
    cy.contains('Plants').should('be.visible');
    cy.contains('Sales').should('be.visible');
    cy.contains('Logout').should('be.visible');
});