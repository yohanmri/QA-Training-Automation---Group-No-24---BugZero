// cypress/e2e/step_definitions/user/salesAuthSteps.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("user is not logged in", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => win.sessionStorage.clear());
});

When("unauthenticated user navigates directly to {string}", (path) => {
  cy.visit(path, { failOnStatusCode: false });
});

Then(
  "validate unauthenticated user is redirected to {string}",
  (expectedPath) => {
    cy.location("pathname", { timeout: 10000 }).should("include", expectedPath);
  }
);

Then("validate login page endpoint is accessible", () => {
  cy.request({
    url: "/ui/login",
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body).to.include("<title>QA Training App | Login</title>");
  });
});
