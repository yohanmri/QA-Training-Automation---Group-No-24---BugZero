export const LoginPage = {
  url: "/ui/login",
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  submitBtn: 'button[type="submit"]',
  dashboardText: "Dashboard",

  visit() {
    cy.visit(this.url);
    cy.url().should("include", "/ui/login");
  },

  login(username, password) {
    this.visit();
    cy.get(this.usernameInput).clear().type(username);
    cy.get(this.passwordInput).clear().type(password);
    cy.get(this.submitBtn).click();

    cy.url().should("include", "/ui/dashboard");
    cy.contains(this.dashboardText).should("be.visible");
  },
};
