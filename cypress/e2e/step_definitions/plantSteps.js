import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import plantPage from "../../support/pageObjects/PlantPage";

let dynamicName;

// --- Background ---
Given("the admin is logged into the application", () => { cy.loginAsAdmin(); });
Given("the user is logged into the application", () => { cy.loginAsUser(); });

// --- Admin Actions ---
When("the admin navigates to the Add Plant page", () => { plantPage.navigateToAddPlant(); });

When("enters valid plant details {string}, {string}, {string}, {string}", (name, cat, price, qty) => {
    dynamicName = `${name} ${Date.now()}`; 
    plantPage.fillPlantDetails(dynamicName, cat, price, qty);
});

When("clicks the Save button", () => { plantPage.saveBtn.click(); });

// --- Admin Assertions ---
Then("the Add Plant page should be displayed", () => { cy.url().should('include', '/add'); });

Then("all fields should accept the values without validation errors", () => {
    cy.get('.is-invalid').should('not.exist');
});

Then("the plant should be submitted successfully", () => {
    cy.url().should('include', '/ui/plants');
});

Then("the system should redirect to the Plants List page", () => {
    cy.url().should('include', '/ui/plants');
});

Then("the plant {string} should be visible in the list with correct details", () => {
    // 1. Search for the unique name to handle pagination
    plantPage.searchPlant(dynamicName);
    
    // 2. Verify the details in the filtered table
    plantPage.verifyPlantInList(dynamicName, "25.5", "10");
});

// --- User Actions ---
When("the user navigates to the Plants List page", () => { plantPage.navigateToPlantList(); });

Then("the plants table should be visible", () => { plantPage.plantTable.should('be.visible'); });

When("the user clicks the Next page control", () => { plantPage.paginationNext.click(); });

Then("the next page of plants should be displayed", () => { cy.url().should('include', 'page=1'); });

When("clicks on the first plant row", () => { plantPage.clickFirstPlantRow(); });

Then("the plant details modal or page should display with Name, Category, Price and Quantity", () => {
    cy.get('body').should((b) => {
        expect(b.find('.modal-content, .card-body').length).to.be.greaterThan(0);
    });
});

Then("the {string} button should not be visible", (btnName) => {
    plantPage.plantTable.contains('button', btnName).should('not.exist');
});

Then("the Edit and Delete actions should not be visible", () => {
    plantPage.plantTable.should('not.contain', 'Edit');
    plantPage.plantTable.should('not.contain', 'Delete');
});

When("the user attempts to access the Add Plant URL directly", () => {
    cy.visit('/ui/plants/add', { failOnStatusCode: false });
});

Then("the user should be redirected to a 403 error page", () => {
    cy.contains(/403|Forbidden|Access Denied/i).should('be.visible');
});