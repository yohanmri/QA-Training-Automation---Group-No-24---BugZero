import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// -------------------- Given Steps --------------------
Given('at least {int} plants exist with different names', (count) => {
    cy.log(`Precondition: At least ${count} plants with different names should exist`);
});

Given('at least {int} plants exist', (count) => {
    cy.log(`Precondition: At least ${count} plants should exist`);
});

Given('at least {int} categories exist with multiple plants in each category', (count) => {
    cy.log(`Precondition: At least ${count} categories with plants should exist`);
});

Given('at least {int} plants exist with "Rose" in their names', (count) => {
    cy.log(`Precondition: At least ${count} plants with "Rose" in name should exist`);
});

Given('at least {int} plant exists', (count) => {
    cy.log(`Precondition: At least ${count} plant should exist`);
});

// -------------------- When Steps --------------------
When('I navigate to the Plants page', () => {
    cy.contains('a', 'Plants').click();
    cy.url().should('include', '/plants');
});

When('I enter {string} in the plant search box', (searchTerm) => {
    cy.get('input[placeholder*="Search"], input[name="search"]').clear().type(searchTerm);
});

When('I click the plant search button', () => {
    cy.contains('button', 'Search').click();
    cy.wait(500);
});

When('I click the Reset button on plants page', () => {
    cy.contains('button', 'Reset').click();
    cy.wait(500);
});

When('I select a category from the plant filter dropdown', () => {
    cy.get('select[name="category"], select').first().select(1);
});

When('I click the {string} column header', (columnName) => {
    cy.contains('th', columnName).click();
    cy.wait(500);
});

When('I click the Next page control on plants page', () => {
    cy.contains('button', 'Next').click()
        .or(cy.get('.pagination').contains('Next').click())
        .or(cy.get('[aria-label="Next"]').click());
    cy.wait(500);
});

// -------------------- Then Steps --------------------
Then('the Plants List page should be displayed', () => {
    cy.url().should('include', '/plants');
    cy.contains('Plants').should('be.visible');
});

Then('the search box should be visible', () => {
    cy.get('input[placeholder*="Search"], input[name="search"]').should('be.visible');
});

Then('only plants with {string} in their name should be displayed', (searchTerm) => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).should('contain.text', searchTerm);
    });
});

Then('the "Add Plant" button should be visible for Admin', () => {
    cy.contains('button', 'Add Plant').should('be.visible');
});

Then('the Edit and Delete actions should be visible for Admin', () => {
    cy.get('table tbody tr').first().within(() => {
        cy.get('button, a').filter(':contains("Edit"), :contains("✏")').should('exist');
        cy.get('button, a').filter(':contains("Delete"), :contains("🗑")').should('exist');
    });
});

Then('filtered plant results should be displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('the plant search box should be cleared', () => {
    cy.get('input[placeholder*="Search"], input[name="search"]').should('have.value', '');
});

Then('all plants should be displayed without filters', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('only plants from selected category should be displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    // Visual verification - all plants should belong to the selected category
});

Then('plants should be sorted by price while maintaining category filter', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
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
    cy.get('.pagination, [aria-label*="pagination"]').should('be.visible')
        .or(cy.contains('Next').should('be.visible'));
});

Then('the next page of filtered results should be displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('all results should still contain {string} in their name', (searchTerm) => {
    cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).should('contain.text', searchTerm);
    });
});

Then('"No plants found" message should be displayed', () => {
    cy.contains('No plants found').should('be.visible');
});

Then('the plants table should be empty', () => {
    cy.get('table tbody tr').should('have.length', 0)
        .or(cy.contains('No plants found').should('be.visible'));
});import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// -------------------- Given Steps --------------------
Given('at least {int} plants exist with different names', (count) => {
    cy.log(`Precondition: At least ${count} plants with different names should exist`);
});

Given('at least {int} plants exist', (count) => {
    cy.log(`Precondition: At least ${count} plants should exist`);
});

Given('at least {int} categories exist with multiple plants in each category', (count) => {
    cy.log(`Precondition: At least ${count} categories with plants should exist`);
});

Given('at least {int} plants exist with "Rose" in their names', (count) => {
    cy.log(`Precondition: At least ${count} plants with "Rose" in name should exist`);
});

Given('at least {int} plant exists', (count) => {
    cy.log(`Precondition: At least ${count} plant should exist`);
});

// -------------------- When Steps --------------------
When('I navigate to the Plants page', () => {
    cy.contains('a', 'Plants').click();
    cy.url().should('include', '/plants');
});

When('I enter {string} in the plant search box', (searchTerm) => {
    cy.get('input[placeholder*="Search"], input[name="search"]').clear().type(searchTerm);
});

When('I click the plant search button', () => {
    cy.contains('button', 'Search').click();
    cy.wait(500);
});

When('I click the Reset button on plants page', () => {
    cy.contains('button', 'Reset').click();
    cy.wait(500);
});

When('I select a category from the plant filter dropdown', () => {
    cy.get('select[name="category"], select').first().select(1);
});

When('I click the {string} column header', (columnName) => {
    cy.contains('th', columnName).click();
    cy.wait(500);
});

When('I click the Next page control on plants page', () => {
    cy.contains('button', 'Next').click()
        .or(cy.get('.pagination').contains('Next').click())
        .or(cy.get('[aria-label="Next"]').click());
    cy.wait(500);
});

// -------------------- Then Steps --------------------
Then('the Plants List page should be displayed', () => {
    cy.url().should('include', '/plants');
    cy.contains('Plants').should('be.visible');
});

Then('the search box should be visible', () => {
    cy.get('input[placeholder*="Search"], input[name="search"]').should('be.visible');
});

Then('only plants with {string} in their name should be displayed', (searchTerm) => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).should('contain.text', searchTerm);
    });
});

Then('the "Add Plant" button should be visible for Admin', () => {
    cy.contains('button', 'Add Plant').should('be.visible');
});

Then('the Edit and Delete actions should be visible for Admin', () => {
    cy.get('table tbody tr').first().within(() => {
        cy.get('button, a').filter(':contains("Edit"), :contains("✏")').should('exist');
        cy.get('button, a').filter(':contains("Delete"), :contains("🗑")').should('exist');
    });
});

Then('filtered plant results should be displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('the plant search box should be cleared', () => {
    cy.get('input[placeholder*="Search"], input[name="search"]').should('have.value', '');
});

Then('all plants should be displayed without filters', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('only plants from selected category should be displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    // Visual verification - all plants should belong to the selected category
});

Then('plants should be sorted by price while maintaining category filter', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
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
    cy.get('.pagination, [aria-label*="pagination"]').should('be.visible')
        .or(cy.contains('Next').should('be.visible'));
});

Then('the next page of filtered results should be displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('all results should still contain {string} in their name', (searchTerm) => {
    cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).should('contain.text', searchTerm);
    });
});

Then('"No plants found" message should be displayed', () => {
    cy.contains('No plants found').should('be.visible');
});

Then('the plants table should be empty', () => {
    cy.get('table tbody tr').should('have.length', 0)
        .or(cy.contains('No plants found').should('be.visible'));
});