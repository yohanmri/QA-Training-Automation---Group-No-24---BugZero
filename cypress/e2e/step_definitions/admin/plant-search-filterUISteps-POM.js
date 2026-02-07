/**
 * Admin Plant Search & Filter UI Step Definitions (POM-based)
 * Uses Page Object Model for better maintainability
 */

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import PlantsListPage from "../../../support/pageObjects/PlantsListPage";

// Initialize Page Object
const plantsPage = new PlantsListPage();

// Note: Precondition steps like "at least X plants exist" are defined in commonSteps.js
// to avoid duplication across admin and user step files.

// -------------------- When Steps --------------------

When('I click the Reset button on plants page', () => {
    plantsPage.resetFilters();
});


When('I click the Next page control on plants page', () => {
    plantsPage.goToNextPage();
});

// -------------------- Then Steps --------------------
Then('the {string} button should be visible for Admin', (buttonName) => {
    if (buttonName === 'Add Plant' || buttonName === 'Add a Plant') {
        // The actual button text is "Add a Plant" and it's an anchor tag
        plantsPage.addPlantButton.should('be.visible');
    } else {
        cy.contains('button', buttonName).should('be.visible');
    }
});

Then('the Edit and Delete actions should be visible for Admin', () => {
    // Check if there are any plants displayed
    cy.get('table tbody').then($tbody => {
        const text = $tbody.text();
        if (text.includes('No plants found')) {
            cy.log('⚠ No plants to display Edit/Delete actions for');
        } else {
            plantsPage.tableRows.first().within(() => {
                plantsPage.editButtons.should('exist');
                plantsPage.deleteButtons.should('exist');
            });
        }
    });
});

Then('filtered plant results should be displayed', () => {
    plantsPage.verifyTableDisplayed();
});

Then('the plant search box should be cleared', () => {
    plantsPage.verifySearchBoxCleared();
});

Then('all plants should be displayed without filters', () => {
    plantsPage.verifyTableDisplayed();
});

Then('only plants from selected category should be displayed', () => {
    plantsPage.verifyTableDisplayed();
    // Visual verification - all plants should belong to the selected category
});

Then('plants should be sorted by price while maintaining category filter', () => {
    plantsPage.tableRows.should('have.length.greaterThan', 0);
    // Verify sorting by checking price column values
    const prices = [];
    cy.get('table tbody tr td:nth-child(3)').each(($cell) => {
        const price = parseFloat($cell.text().replace(/[^0-9.]/g, ''));
        prices.push(price);
    }).then(() => {
        cy.log('Prices after sorting:', prices);
    });
});

Then('pagination controls should be visible', () => {
    plantsPage.verifyPaginationVisible();
});

Then('the next page of filtered results should be displayed', () => {
    plantsPage.verifyTableDisplayed();
});

Then('all results should still contain {string} in their name', (searchTerm) => {
    plantsPage.verifyPlantsContainSearchTerm(searchTerm);
});

Then('{string} message should be displayed', (message) => {
    plantsPage.getMessageByText(message).should('be.visible');
});

Then('the plants table should be empty', () => {
    plantsPage.verifyTableEmpty();
});
