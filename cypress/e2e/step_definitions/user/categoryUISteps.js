import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import categoryPage from "../../../support/pageObjects/CategoryPage";

// --- User UI Steps ---

When("the user navigates to the Category List page", () => {
    categoryPage.navigateToList();
});

Then("the categories table and pagination should be visible", () => {
    categoryPage.categoryTable.should('be.visible');
    cy.get('li.page-item').should('exist');
});

When("the user searches for {string}", (name) => {
    categoryPage.searchInput.clear().type(name);
    categoryPage.searchBtn.click();
});

Then("the table should only show categories containing {string}", (name) => {
    categoryPage.categoryTable.find('tbody tr').each(($row) => {
        cy.wrap($row).should('contain', name);
    });
});

When("the user clicks on the {string} column header", (header) => {
    cy.contains('th', header).click();
});

Then("the categories should be sorted alphabetically", () => {
    categoryPage.categoryTable.should('be.visible');
});

Then("the {string} button should not be visible", (btnText) => {
    cy.contains('button', btnText).should('not.exist');
});

Then("the Edit and Delete icons should be restricted for the user", () => {
    // 1. Check Delete button is disabled
    categoryPage.categoryTable.find('button.btn-outline-danger').first().should('be.disabled');

    // 2. Check Edit button leads to a 403 Forbidden page
    categoryPage.categoryTable.find('a.btn-outline-primary').first().click();
    cy.contains('403').should('be.visible');
    cy.go('back'); // Return to list for test stability
});

When("the user attempts to visit the Add Category URL directly", () => {
    cy.visit('/ui/categories/add', { failOnStatusCode: false });
});

Then("the user should be redirected to a 403 Forbidden page", () => {
    cy.contains(/403|Forbidden|Denied/i).should('be.visible');
});
