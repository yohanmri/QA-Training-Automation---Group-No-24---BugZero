/**
 * Login Page Object
 * Provides reusable methods for login page interactions
 */

export class LoginPage {
    /**
     * Login with username and password
     * @param {string} username - The username to login with
     * @param {string} password - The password to login with
     */
    static login(username, password) {
        cy.visit('/ui/login');
        cy.get('input[name="username"]').clear().type(username);
        cy.get('input[name="password"]').clear().type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(1000); // Wait for navigation
    }

    /**
     * Visit the login page
     */
    static visit() {
        cy.visit('/ui/login');
        cy.url().should('include', '/login');
    }

    /**
     * Enter username
     * @param {string} username - The username to enter
     */
    static enterUsername(username) {
        cy.get('input[name="username"]').clear().type(username);
    }

    /**
     * Enter password
     * @param {string} password - The password to enter
     */
    static enterPassword(password) {
        cy.get('input[name="password"]').clear().type(password);
    }

    /**
     * Click the login button
     */
    static clickLoginButton() {
        cy.get('button[type="submit"]').click();
    }

    /**
     * Verify login page is displayed
     */
    static verifyLoginPage() {
        cy.url().should('include', '/login');
        cy.get('input[name="username"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    }
}
