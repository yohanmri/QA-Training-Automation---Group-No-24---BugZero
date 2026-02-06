const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');

// ==================== UI CHECKS ====================

Then('the Sales List page header should be displayed', () => {
    cy.get('h1, h2').filter(':contains("Sales")').should('be.visible');
});

Then('the pagination component should be displayed', () => {
    cy.get('nav[aria-label="pagination"], .pagination, [class*="pagination"]').should('be.visible');
});

Then('the {string} button should not be visible', (buttonText) => {
    cy.get('body').then(($body) => {
        const found = $body.find(`button:contains("${buttonText}"), a:contains("${buttonText}")`).filter(':visible').length;
        expect(found, `"${buttonText}" button should not be visible`).to.equal(0);
    });
});

Then('the delete action should not be visible in sales list', () => {
    cy.get('table tbody tr').first().then(($row) => {
        const hasDeleteButton = $row.find('button:contains("Delete"), form button').filter(':visible').length > 0;
        expect(hasDeleteButton, 'Delete action should not be visible').to.equal(false);
    });
});

Then('I should see message {string} or empty table', (message) => {
    cy.get('body').then(($body) => {
        const hasMessage = $body.text().includes(message);
        const hasEmptyTable = $body.find('table tbody tr').length === 0;
        expect(hasMessage || hasEmptyTable, `Should show "${message}" or have empty table`).to.equal(true);
    });
});

// ==================== SORTING ====================

Then('the sales table should be sorted by {string} in {string} order', (columnName, order) => {
    cy.get('table tbody tr').then(($rows) => {
        const values = [];

        // Determine column index based on column name
        let colIndex = 0;
        if (columnName === 'Plant') colIndex = 0;
        else if (columnName === 'Quantity') colIndex = 1;
        else if (columnName === 'Total Price') colIndex = 2;
        else if (columnName === 'Sold At') colIndex = 3;

        $rows.each((i, row) => {
            const cellText = Cypress.$(row).find('td').eq(colIndex).text().trim();

            // Parse based on column type
            if (columnName === 'Quantity' || columnName === 'Total Price') {
                values.push(parseFloat(cellText.replace(/[^0-9.-]/g, '')));
            } else if (columnName === 'Sold At') {
                values.push(new Date(cellText).getTime());
            } else {
                values.push(cellText.toLowerCase());
            }
        });

        // Check if sorted correctly
        const sorted = [...values].sort((a, b) => {
            if (order === 'asc') return a > b ? 1 : -1;
            return a < b ? 1 : -1;
        });

        expect(values, `${columnName} should be sorted ${order}`).to.deep.equal(sorted);
    });
});

When('I click sort by {string}', (columnName) => {
    cy.get('table thead th').filter(`:contains("${columnName}")`).click();
    cy.wait(500); // Wait for sort to apply
});

Then('the URL should contain sort parameter for {string}', (columnName) => {
    // Map column names to URL parameter names
    const paramMap = {
        'Plant': 'plant',
        'Quantity': 'quantity',
        'Total Price': 'totalPrice',
        'Sold At': 'soldAt'
    };

    const param = paramMap[columnName] || columnName.toLowerCase().replace(' ', '');
    cy.url().should('match', new RegExp(`sort=.*${param}`, 'i'));
});

// ==================== PAGINATION ====================

When('I click next page in pagination', () => {
    cy.get('.pagination a:contains("Next"), .pagination button:contains("Next"), [aria-label="Next"]').click();
    cy.wait(500);
});

Then('I should be on page {string}', (pageNumber) => {
    cy.url().should('include', `page=${pageNumber}`);
});
