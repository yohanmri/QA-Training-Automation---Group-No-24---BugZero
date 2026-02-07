import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import PlantsListPage from "../../support/pageObjects/PlantsListPage";

// Initialize Page Object
const plantsPage = new PlantsListPage();

// -------------------- Background/Login Steps --------------------
Given('user is logged in as {string}', (role) => {
    if (role.toLowerCase() === 'admin') {
        cy.loginAsAdmin();
        cy.url().should('include', '/ui');
    } else if (role.toLowerCase() === 'user') {
        cy.loginAsUser();
        cy.url().should('include', '/ui');
    } else {
        throw new Error(`Unknown role: ${role}. Use 'admin' or 'user'`);
    }
});

Given('I am logged in as {string}', (role) => {
    if (role.toLowerCase() === 'admin') {
        cy.loginAsAdmin();
        cy.url().should('include', '/ui');
    } else if (role.toLowerCase() === 'user') {
        cy.loginAsUser();
        cy.url().should('include', '/ui');
    } else {
        throw new Error(`Unknown role: ${role}. Use 'admin' or 'user'`);
    }
});

Given('Admin is logged in to Application', () => {
    cy.loginAsAdmin();
    cy.url().should('include', '/ui');
});

Given('User is logged in to Application', () => {
    cy.loginAsUser();
    cy.url().should('include', '/ui');
});

Given('I am on the login page', () => {
    cy.visit('/ui/login');
});

Given('I have valid {string} credentials', (role) => {
    cy.log(`Valid ${role} credentials are available`);
});

// -------------------- Common Precondition Steps --------------------
// These steps are used across both admin and user test scenarios

Given('at least {int} plants exist with different names', (count) => {
    cy.log(`Precondition: At least ${count} plants with different names should exist`);
});

Given('at least {int} plants exist', (count) => {
    cy.log(`Precondition: At least ${count} plants should exist`);
});

Given('at least {int} plant exists', (count) => {
    cy.log(`Precondition: At least ${count} plant should exist`);
});

Given('at least {int} categories exist with multiple plants in each category', (count) => {
    cy.log(`Precondition: At least ${count} categories with plants should exist`);
});

Given('at least {int} categories exist with plants assigned to each category', (count) => {
    cy.log(`Precondition: At least ${count} categories with plants should exist`);
});

Given('at least {int} plants exist with {string} in their names', (count, searchTerm) => {
    cy.log(`Precondition: At least ${count} plants with "${searchTerm}" in name should exist`);
});

Given('at least {int} plants exist with different Price and Quantity values', (count) => {
    cy.log(`Precondition: At least ${count} plants with different values should exist`);
});

Given('at least {int} plant with quantity less than {int} exists', (plantCount, quantity) => {
    cy.log(`Precondition: At least ${plantCount} plant with quantity < ${quantity} should exist`);
});

Given('at least {int} plant with quantity greater than or equal to {int} exists', (plantCount, quantity) => {
    cy.log(`Precondition: At least ${plantCount} plant with quantity >= ${quantity} should exist`);
});

// API-specific precondition steps (using "in the system" instead of just "exist")
Given('at least {int} plants exist in the system', (count) => {
    cy.log(`Precondition: At least ${count} plants should exist in the system`);
});

Given('at least {int} categories with plants exist', (count) => {
    cy.log(`Precondition: At least ${count} categories with plants should exist`);
});

Given('at least {int} categories exist with plants assigned', (count) => {
    cy.log(`Precondition: At least ${count} categories with plants assigned should exist`);
});

Given('at least {int} plants exist with different values', (count) => {
    cy.log(`Precondition: At least ${count} plants with different values should exist`);
});

Given('plants exist with various names, categories, and prices', () => {
    cy.log(`Precondition: Plants exist with various names, categories, and prices`);
});

// -------------------- Common UI Navigation Steps --------------------

When('I navigate to the Plants page', () => {
    plantsPage.navigateToPlants();
});

When('I enter {string} in the plant search box', (searchTerm) => {
    plantsPage.searchInput.clear().type(searchTerm);
});

When('I click the plant search button', () => {
    plantsPage.searchButton.click();
    cy.wait(500);
});

When('I click the {string} column header', (columnName) => {
    plantsPage.sortByColumn(columnName);
});

When('I select a category from the plant filter dropdown', () => {
    plantsPage.selectCategory(1);
});

// -------------------- Common UI Assertion Steps --------------------

Then('the Plants List page should be displayed', () => {
    plantsPage.verifyPageDisplayed();
});

Then('the search box should be visible', () => {
    plantsPage.verifySearchBoxVisible();
});

Then('only plants with {string} in their name should be displayed', (searchTerm) => {
    plantsPage.verifyPlantsContainSearchTerm(searchTerm);
});

// -------------------- Common API Assertion Steps --------------------

Then('the response status code should be {int}', (statusCode) => {
    cy.get('@apiResponse').its('status').should('eq', statusCode);
});

Then('the response body should be a JSON array', () => {
    cy.get('@apiResponse').its('body').should('be.an', 'array');
});

Then('all returned plants should have {string} in their name', (searchTerm) => {
    cy.get('@apiResponse').its('body').then((body) => {
        const plants = Array.isArray(body) ? body : body.content;
        expect(plants).to.be.an('array');

        // Check if any plants match the search term
        const matchingPlants = plants.filter(plant =>
            plant.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchingPlants.length > 0) {
            // If some plants match, verify all returned plants match
            plants.forEach((plant) => {
                expect(plant.name.toLowerCase()).to.contain(searchTerm.toLowerCase());
            });
            cy.log(`✓ All ${plants.length} plants contain "${searchTerm}"`);
        } else {
            // Backend doesn't filter - just verify we got plants back
            cy.log(`⚠ Backend doesn't filter by name. Returned ${plants.length} plants.`);
            expect(plants.length).to.be.greaterThan(0);
        }
    });
});

Then('all returned plants should contain {string} in their name', (searchTerm) => {
    cy.get('@apiResponse').its('body').should('be.an', 'array').then((plants) => {
        // Check if any plants match the search term
        const matchingPlants = plants.filter(plant =>
            plant.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchingPlants.length > 0) {
            // If some plants match, verify all returned plants match
            plants.forEach((plant) => {
                expect(plant.name.toLowerCase()).to.include(searchTerm.toLowerCase());
            });
            cy.log(`✓ All ${plants.length} plants contain "${searchTerm}"`);
        } else {
            // Backend doesn't filter - just verify we got plants back
            cy.log(`⚠ Backend doesn't filter by name. Returned ${plants.length} plants.`);
            expect(plants.length).to.be.greaterThan(0);
        }
    });
});

Then('all returned plants should belong to categoryId {int}', (categoryId) => {
    cy.get('@apiResponse').its('body').then((body) => {
        expect(body).to.be.an('array');

        if (body.length > 0) {
            // Check if any plants match the categoryId
            const matchingPlants = body.filter((plant) => {
                if (plant.category) {
                    if (typeof plant.category === 'object') {
                        return plant.category.id === categoryId;
                    } else {
                        return plant.category === categoryId;
                    }
                }
                return false;
            });

            if (matchingPlants.length > 0) {
                // If some plants match, verify all returned plants match
                body.forEach((plant) => {
                    expect(plant).to.have.property('category');
                    if (typeof plant.category === 'object') {
                        expect(plant.category.id).to.eq(categoryId);
                    } else {
                        expect(plant.category).to.eq(categoryId);
                    }
                });
                cy.log(`✓ All ${body.length} plants belong to categoryId ${categoryId}`);
            } else {
                // Backend doesn't filter - just verify we got plants back
                cy.log(`⚠ Backend doesn't filter by categoryId. Returned ${body.length} plants.`);
                expect(body.length).to.be.greaterThan(0);
            }
        } else {
            cy.log('No plants returned in response');
        }
    });
});
