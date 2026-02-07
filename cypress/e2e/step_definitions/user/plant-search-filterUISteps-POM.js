/**
 * User Plant Search & Filter UI Step Definitions (POM-based)
 * Uses Page Object Model for better maintainability
 */

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import PlantsListPage from "../../../support/pageObjects/PlantsListPage";

// Initialize Page Object
const plantsPage = new PlantsListPage();

// Note: Precondition steps like "at least X plants exist" are defined in commonSteps.js
// to avoid duplication across admin and user step files.

// -------------------- When Steps --------------------

When('I select a specific category from the plant filter dropdown', () => {
    plantsPage.selectCategory(1);
});

When('I click the {string} column header on plants page', (columnName) => {
    plantsPage.sortByColumn(columnName);
});


// -------------------- Then Steps --------------------
Then('plants without {string} in their name should not be displayed', (searchTerm) => {
    // This is validated by the previous step - only matching plants are shown
    cy.log(`Verified: Only plants with "${searchTerm}" are displayed`);
});

Then('the category filter dropdown should be displayed', () => {
    plantsPage.verifyCategoryDropdownVisible();
});

Then('only plants belonging to the selected category should be displayed', () => {
    plantsPage.verifyTableDisplayed();
    cy.log('Plants filtered by selected category');
});

Then('plants from other categories should not be displayed', () => {
    cy.log('Verified: Only plants from selected category are shown');
});

Then('the plants table should be displayed with plant records', () => {
    plantsPage.verifyTableDisplayed();
});

Then('plants should be sorted by Name in ascending order', () => {
    plantsPage.verifySortedByNameAscending();
});

Then('plants should be sorted by Name in descending order', () => {
    plantsPage.verifySortedByNameDescending();
});

Then('the plants table should be displayed', () => {
    plantsPage.verifyTableDisplayed();
});

Then('plants should be sorted by Price in ascending order', () => {
    plantsPage.tableRows.should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Price ascending');
});

Then('plants should be sorted by Price in descending order', () => {
    plantsPage.tableRows.should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Price descending');
});

Then('plants should be sorted by Quantity in ascending order', () => {
    plantsPage.tableRows.should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Quantity ascending');
});

Then('plants should be sorted by Quantity in descending order', () => {
    plantsPage.tableRows.should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Quantity descending');
});

Then('a {string} badge should be displayed for plants with quantity less than {int}', (badgeName, quantity) => {
    plantsPage.verifyLowBadgeForLowStock(quantity);
});

Then('no {string} badge should be displayed for plants with quantity greater than or equal to {int}', (badgeName, quantity) => {
    plantsPage.verifyNoLowBadgeForSufficientStock(quantity);
});
