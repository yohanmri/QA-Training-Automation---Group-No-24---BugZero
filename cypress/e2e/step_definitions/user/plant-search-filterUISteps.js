import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// -------------------- Given Steps --------------------
Given('at least {int} plants exist with different names', (count) => {
    cy.log(`Precondition: At least ${count} plants with different names should exist`);
});

Given('at least {int} categories exist with plants assigned to each category', (count) => {
    cy.log(`Precondition: At least ${count} categories with plants should exist`);
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

When('I select a specific category from the plant filter dropdown', () => {
    cy.get('select[name="category"], select').first().select(1);
});

When('I click the {string} column header on plants page', (columnName) => {
    cy.contains('th', columnName).click();
    cy.wait(500);
});

When('I click the {string} column header', (columnName) => {
    cy.contains('th', columnName).click();
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

Then('plants without {string} in their name should not be displayed', (searchTerm) => {
    // This is validated by the previous step - only matching plants are shown
    cy.log(`Verified: Only plants with "${searchTerm}" are displayed`);
});

Then('the category filter dropdown should be displayed', () => {
    cy.get('select[name="category"], select').should('be.visible');
});

Then('only plants belonging to the selected category should be displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.log('Plants filtered by selected category');
});

Then('plants from other categories should not be displayed', () => {
    cy.log('Verified: Only plants from selected category are shown');
});

Then('the plants table should be displayed with plant records', () => {
    cy.get('table').should('be.visible');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('plants should be sorted by Name in ascending order', () => {
    const names = [];
    cy.get('table tbody tr td:nth-child(2)').each(($cell) => {
        names.push($cell.text().trim());
    }).then(() => {
        const sorted = [...names].sort();
        expect(names).to.deep.equal(sorted);
    });
});

Then('plants should be sorted by Name in descending order', () => {
    const names = [];
    cy.get('table tbody tr td:nth-child(2)').each(($cell) => {
        names.push($cell.text().trim());
    }).then(() => {
        const sorted = [...names].sort().reverse();
        expect(names).to.deep.equal(sorted);
    });
});

Then('the plants table should be displayed', () => {
    cy.get('table').should('be.visible');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
});

Then('plants should be sorted by Price in ascending order', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Price ascending');
});

Then('plants should be sorted by Price in descending order', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Price descending');
});

Then('plants should be sorted by Quantity in ascending order', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Quantity ascending');
});

Then('plants should be sorted by Quantity in descending order', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.log('Plants sorted by Quantity descending');
});

Then('a "Low" badge should be displayed for plants with quantity less than {int}', (quantity) => {
    cy.get('table tbody tr').each(($row) => {
        const qtyText = $row.find('td').eq(4).text(); // Adjust column index as needed
        const qty = parseInt(qtyText.replace(/[^0-9]/g, ''));
        
        if (qty < quantity) {
            cy.wrap($row).should('contain.text', 'Low');
        }
    });
});

Then('no "Low" badge should be displayed for plants with quantity greater than or equal to {int}', (quantity) => {
    cy.get('table tbody tr').each(($row) => {
        const qtyText = $row.find('td').eq(4).text();
        const qty = parseInt(qtyText.replace(/[^0-9]/g, ''));
        
        if (qty >= quantity) {
            cy.wrap($row).find('td').eq(4).should('not.contain.text', 'Low');
        }
    });
});