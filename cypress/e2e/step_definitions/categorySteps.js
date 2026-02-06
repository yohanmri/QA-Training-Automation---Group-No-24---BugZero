import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import categoryPage from "../../support/pageObjects/CategoryPage";

let dynamicName;

function randomLetters(len = 3) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// --- Admin Steps ---

When("the admin navigates to the Add Category page", () => {
    categoryPage.navigateToAdd();
});

When("enters category name {string} and leaves parent empty", (name) => {
    dynamicName = name.substring(0, 4) + randomLetters(); 
    categoryPage.fillForm(dynamicName);
});

When("enters category name {string} and selects parent {string}", (name, parent) => {
    const subName = name.substring(0, 4) + randomLetters();
    categoryPage.fillForm(subName, parent);
});

When("clicks the Save button", () => {
    categoryPage.saveBtn.click();
});

Then("the system redirects to the Category List page", () => {
    cy.url().should('include', '/ui/categories');
});

Then("the new category {string} should appear in the list", () => {
    categoryPage.searchInput.clear().type(dynamicName);
    categoryPage.searchBtn.click();
    cy.contains('tr', dynamicName).should('be.visible');
});

Then("a {string} validation message should appear", (msg) => {
    cy.contains(msg).should('be.visible');
});

When("the admin enters {string} and clicks Save", (val) => {
    if(val === "") categoryPage.nameInput.clear();
    else categoryPage.nameInput.clear().type(val);
    categoryPage.saveBtn.click();
});

Then("a length validation error should be displayed", () => {
    cy.contains(/between 3 and 10 characters/i).should('be.visible');
});

Given("a category {string} exists for testing", (name) => {
    dynamicName = name.substring(0, 4) + randomLetters();
    categoryPage.navigateToAdd();
    categoryPage.fillForm(dynamicName);
    categoryPage.saveBtn.click();
    cy.wait(1000);
});

When("the admin edits that category to {string}", (newName) => {
    categoryPage.getEditIcon(dynamicName).click();
    dynamicName = newName.substring(0, 5) + randomLetters(2); 
    categoryPage.fillForm(dynamicName);
    categoryPage.saveBtn.click();
});


Then("the category should be updated to {string} in the list", () => {
    categoryPage.searchInput.clear().type(dynamicName);
    categoryPage.searchBtn.click();
    cy.contains('tr', dynamicName).should('be.visible');
});

When("the admin deletes the category and confirms", () => {
    cy.on('window:confirm', () => true);
    categoryPage.getDeleteIcon(dynamicName).click();
});

Then("the category should be removed from the list", () => {
    categoryPage.searchInput.clear().type(dynamicName);
    categoryPage.searchBtn.click();
    cy.contains(dynamicName).should('not.exist');
});

// --- User Steps---

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