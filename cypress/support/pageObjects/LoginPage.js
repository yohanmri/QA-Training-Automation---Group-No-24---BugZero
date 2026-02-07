/**
 * Page Object Model for Login Page
 * Contains all selectors and methods for interacting with the Login page
 */

class LoginPage {
    // ========== Selectors ==========

    get usernameInput() {
        return cy.get('input[name="username"]');
    }

    get passwordInput() {
        return cy.get('input[name="password"]');
    }

    get loginButton() {
        return cy.get('button[type="submit"]');
    }

    get errorMessage() {
        return cy.get('.error-message, .alert-danger, [role="alert"]');
    }

    get loginForm() {
        return cy.get('form');
    }

    // ========== Actions ==========

    /**
     * Visit the login page
     */
    visit() {
        cy.visit('/ui/login');
        return this;
    }

    /**
     * Enter username
     * @param {string} username - Username to enter
     */
    enterUsername(username) {
        this.usernameInput.clear().type(username);
        return this;
    }

    /**
     * Enter password
     * @param {string} password - Password to enter
     */
    enterPassword(password) {
        this.passwordInput.clear().type(password);
        return this;
    }

    /**
     * Click login button
     */
    clickLogin() {
        this.loginButton.click();
        cy.wait(1000);
        return this;
    }

    /**
     * Perform complete login action
     * @param {string} username - Username
     * @param {string} password - Password
     */
    login(username, password) {
        this.visit();
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLogin();
        return this;
    }

    /**
     * Login as Admin
     */
    loginAsAdmin() {
        this.login('admin', 'admin123');
        return this;
    }

    /**
     * Login as User
     */
    loginAsUser() {
        this.login('user', 'user123');
        return this;
    }

    // ========== Assertions ==========

    /**
     * Verify login page is displayed
     */
    verifyLoginPageDisplayed() {
        cy.url().should('include', '/login');
        this.loginForm.should('be.visible');
        return this;
    }

    /**
     * Verify successful login (redirected to dashboard)
     */
    verifyLoginSuccessful() {
        cy.url().should('include', '/ui');
        cy.url().should('not.include', '/login');
        return this;
    }

    /**
     * Verify error message is displayed
     * @param {string} expectedMessage - Expected error message (optional)
     */
    verifyErrorMessage(expectedMessage = null) {
        this.errorMessage.should('be.visible');
        if (expectedMessage) {
            this.errorMessage.should('contain.text', expectedMessage);
        }
        return this;
    }
}

export default LoginPage;
