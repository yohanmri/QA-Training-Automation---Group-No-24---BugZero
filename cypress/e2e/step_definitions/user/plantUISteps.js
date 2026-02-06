import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import plantPage from "../../../support/pageObjects/PlantPage";

// --- Background ---
Given("the user is logged into the application", () => { cy.loginAsUser(); });

// --- User Actions ---
When("the user navigates to the Plants List page", () => { plantPage.navigateToPlantList(); });

When("the user clicks the Next page control", () => { plantPage.paginationNext.click(); });

When("clicks on the first plant row", () => { plantPage.clickFirstPlantRow(); });

When("the user attempts to access the Add Plant URL directly", () => {
    cy.visit('/ui/plants/add', { failOnStatusCode: false });
});

// --- User Assertions ---
Then("the Plants List page should be displayed", () => {
    cy.url().should('include', '/ui/plants');
});

Then("the plants table should be visible", () => {
    plantPage.plantTable.should('be.visible');
});

Then("at least one plant row should be displayed", () => {
    plantPage.plantTable.find('tbody tr').should('have.length.at.least', 1);
});

Then("pagination controls should be visible", () => {
    cy.get('.pagination, [class*="pagination"], nav[aria-label*="pagination"]').should('be.visible');
});

Then("the next page of plants should be displayed", () => {
    cy.url().should('include', 'page=1');
});

Then("the current page indicator should update accordingly", () => {
    cy.get('.pagination .active, .page-item.active, [class*="active"]').should('exist');
});

Then("at least one plant record should be visible in the table", () => {
    plantPage.plantTable.find('tbody tr').should('have.length.at.least', 1);
});

Then("the plant details modal or page should display with Name, Category, Price and Quantity", () => {
    cy.get('body').should((b) => {
        expect(b.find('.modal-content, .card-body').length).to.be.greaterThan(0);
    });
});

Then("the {string} button should not be visible", (btnName) => {
    plantPage.plantTable.contains('button', btnName).should('not.exist');
});

Then("the plants table should display plant records", () => {
    plantPage.plantTable.should('be.visible');
    plantPage.plantTable.find('tbody tr').should('have.length.at.least', 1);
});

Then("the Edit and Delete actions should not be visible", () => {
    plantPage.plantTable.should('not.contain', 'Edit');
    plantPage.plantTable.should('not.contain', 'Delete');
});

Then("the user should be redirected to a 403 error page", () => {
    cy.contains(/403|Forbidden|Access Denied/i).should('be.visible');
});

Then("the Add Plant form should not be accessible", () => {
    cy.get('form').should('not.exist');
});
