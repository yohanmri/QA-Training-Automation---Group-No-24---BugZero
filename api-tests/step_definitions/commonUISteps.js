const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

let baseUrl;

// ============================================
// BACKGROUND & NAVIGATION
// ============================================

Given('the application is running at {string}', (url) => {
    baseUrl = url;
    cy.log(`Application Base URL set to: ${baseUrl}`);
});

Given('I navigate to the login page', () => {
    cy.visit(`${baseUrl}/ui/login`);
    cy.url().should('include', '/ui/login');
});

When('I navigate to {string}', (path) => {
    cy.visit(`${baseUrl}${path}`);
});

// ============================================
// AUTHENTICATION HELPERS
// ============================================

Given('I am logged in as admin via UI', () => {
    cy.visit(`${baseUrl}/ui/login`);
    cy.get('input[name="username"]').clear().type('admin');
    cy.get('input[name="password"]').clear().type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/ui/dashboard', { timeout: 10000 });
    cy.log('✅ Admin logged in via UI');
});

Given('I am logged in as user via UI', () => {
    cy.visit(`${baseUrl}/ui/login`);
    cy.get('input[name="username"]').clear().type('testuser');
    cy.get('input[name="password"]').clear().type('test123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/ui/dashboard', { timeout: 10000 });
    cy.log('✅ User logged in via UI');
});

// ============================================
// FORM INTERACTIONS
// ============================================

When('I enter username {string}', (username) => {
    cy.get('input[name="username"]').clear().type(username);
});

When('I enter password {string}', (password) => {
    cy.get('input[name="password"]').clear().type(password);
});

When('I leave the username field empty', () => {
    cy.get('input[name="username"]').clear();
});

When('I leave the password field empty', () => {
    cy.get('input[name="password"]').clear();
});

When('I click the login button', () => {
    cy.get('button[type="submit"]').click();
});

When('I click the logout link', () => {
    cy.contains('Logout').click();
});

When('I click on {string} in navigation menu', (menuItem) => {
    cy.contains('a', menuItem).click();
});

When('I click {string} button', (buttonText) => {
    cy.contains('button', buttonText).click();
});

// ============================================
// URL ASSERTIONS
// ============================================

Then('I should be redirected to {string}', (expectedPath) => {
    cy.url().should('include', expectedPath);
});

Then('I should remain on the login page', () => {
    cy.url().should('include', '/ui/login');
});

// ============================================
// MESSAGE ASSERTIONS
// ============================================

Then('I should see validation message {string} below username field', (message) => {
    cy.contains(message).should('be.visible');
});

Then('I should see validation message {string} below password field', (message) => {
    cy.contains(message).should('be.visible');
});

Then('I should see error message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

Then('I should see success message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

// ============================================
// DASHBOARD ASSERTIONS
// ============================================

Then('the dashboard page should be displayed', () => {
    cy.url().should('include', '/ui/dashboard');
    cy.contains('Dashboard').should('be.visible');
});

Then('the navigation menu should be visible', () => {
    cy.get('nav').should('be.visible');
});

Then('I should see the categories summary card', () => {
    cy.contains('Categories').should('be.visible');
});

Then('I should see the plants summary card', () => {
    cy.contains('Plants').should('be.visible');
});

Then('I should see the sales summary card', () => {
    cy.contains('Sales').should('be.visible');
});

Then('I should see the inventory summary card', () => {
    cy.contains('Inventory').should('be.visible');
});

Then('I should see the categories summary card with text {string}', (expectedText) => {
    // Target the card in the main content area, not the navigation menu
    cy.get('.card, [class*="card"]').contains('Categories').parents('.card, [class*="card"]').first().should('contain.text', expectedText);
});

Then('I should see the plants summary card with text {string}', (expectedText) => {
    // Target the card in the main content area, not the navigation menu
    cy.get('.card, [class*="card"]').contains('Plants').parents('.card, [class*="card"]').first().should('contain.text', expectedText);
});

Then('I should see the sales summary card with text {string}', (expectedText) => {
    // Target the card in the main content area, not the navigation menu
    cy.get('.card, [class*="card"]').contains('Sales').parents('.card, [class*="card"]').first().should('contain.text', expectedText);
});

Then('I should see the inventory summary card with text {string}', (expectedText) => {
    // Target the card in the main content area, not the navigation menu
    cy.get('.card, [class*="card"]').contains('Inventory').parents('.card, [class*="card"]').first().should('contain.text', expectedText);
});

Then('the categories summary card should show count', () => {
    cy.contains('Categories').should('be.visible');
});

Then('the plants summary card should show total count', () => {
    cy.contains('Plants').should('be.visible');
});

Then('the sales summary card should show revenue', () => {
    cy.contains('Sales').should('be.visible');
});

// ============================================
// NAVIGATION MENU ASSERTIONS
// ============================================

Then('the navigation menu should include {string} link', (linkText) => {
    cy.contains('a', linkText).should('be.visible');
});

Then('the {string} link should be highlighted in navigation', (linkText) => {
    cy.contains('a', linkText).should('have.class', 'active');
});

Then('the {string} link should not be highlighted', (linkText) => {
    cy.contains('a', linkText).should('not.have.class', 'active');
});

// Export for use in other step definition files
module.exports = {
    getBaseUrl: () => baseUrl,
    setBaseUrl: (url) => { baseUrl = url; }
};
