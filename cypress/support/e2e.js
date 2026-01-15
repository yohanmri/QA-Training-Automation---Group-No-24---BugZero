// Import commands
import './commands';

// Import Allure
import '@shelex/cypress-allure-plugin';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
    // Prevent Cypress from failing tests on uncaught exceptions
    return false;
});

// Custom before hook
beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
});
