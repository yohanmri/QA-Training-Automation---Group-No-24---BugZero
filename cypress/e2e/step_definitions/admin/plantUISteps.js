import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import plantPage from "../../../support/pageObjects/PlantPage";

let dynamicName;

// --- Background ---
Given("the admin is logged into the application", () => { cy.loginAsAdmin(); });

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
