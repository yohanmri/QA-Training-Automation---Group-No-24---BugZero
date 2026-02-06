const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { SalesAdminPage } = require('../../../cypress/support/pageObjects/salesAdminPage');
const { PlantsPage } = require('../../../cypress/support/pageObjects/plantsPage');

// State variables
let selectedPlant = {};
let salesRowCountBefore = 0;
let deletedSaleData = {};

// ==================== NAVIGATION ====================

When('I click on {string} button', (buttonText) => {
    cy.contains('button', buttonText).or(cy.contains('a', buttonText)).click();
});

// ==================== UI CHECKS ====================

Then('the {string} button should be visible', (buttonText) => {
    cy.contains(buttonText).should('be.visible');
});

Then('the sales actions column should be visible', () => {
    SalesAdminPage.actionsHeader().should('be.visible');
});

Then('the Sell Plant form should be displayed', () => {
    SalesAdminPage.sellPlantHeader().should('be.visible');
    SalesAdminPage.plantSelect().should('be.visible');
    SalesAdminPage.quantityInput().should('be.visible');
    SalesAdminPage.sellButton().should('be.visible');
    SalesAdminPage.cancelButton().should('be.visible');
});

Then('I should be on {string}', (path) => {
    cy.url().should('include', path);
});

// ==================== FORM INTERACTIONS ====================

When('I leave plant unselected', () => {
    SalesAdminPage.plantSelect().select('');
});

When('I enter quantity {string} in sales form', (quantity) => {
    SalesAdminPage.quantityInput().clear().type(quantity);
});

When('I click the {string} button in sales form', (buttonText) => {
    if (buttonText === 'Sell') {
        SalesAdminPage.sellButton().click();
    } else if (buttonText === 'Cancel') {
        SalesAdminPage.cancelButton().click();
    }
});

When('I select the first plant with stock at least {int}', (minStock) => {
    SalesAdminPage.selectFirstPlantWithStockAtLeast(minStock).then((plant) => {
        selectedPlant = plant;
        cy.wrap(plant).as('selectedPlant');
    });
});

// ==================== VALIDATION ====================

Then('I should see validation message {string}', (message) => {
    cy.contains(message).should('be.visible');
});

Then('the quantity input should be invalid', () => {
    SalesAdminPage.quantityInput().then(($el) => {
        expect($el[0].checkValidity(), 'quantity should be invalid').to.equal(false);
    });
});

// ==================== SALE ASSERTIONS ====================

Then('the newly created sale should be visible in the table', () => {
    cy.get('@selectedPlant').then((plant) => {
        SalesAdminPage.findSaleRow(plant.plantName, '1').should('have.length.greaterThan', 0);
    });
});

Then('the selected plant stock should be reduced by {int}', (delta) => {
    cy.get('@selectedPlant').then((plant) => {
        PlantsPage.findPlantByName(plant.plantName).then((plantAfter) => {
            expect(plantAfter.stock).to.equal(plant.stock - delta);
        });
    });
});

// ==================== ROW COUNT ====================

When('I capture the current sales row count', () => {
    SalesAdminPage.getSalesRowCount().then((count) => {
        salesRowCountBefore = count;
        cy.wrap(count).as('salesRowCountBefore');
    });
});

Then('the sales row count should be unchanged', () => {
    SalesAdminPage.getSalesRowCount().then((countAfter) => {
        expect(countAfter).to.equal(salesRowCountBefore);
    });
});

// ==================== DELETE OPERATIONS ====================

Then('the sales table should have at least {int} record', (minRecords) => {
    cy.get('table tbody tr').should('have.length.at.least', minRecords);
});

When('I delete the first sale after confirming', () => {
    // Capture sale data before deletion
    cy.get('table tbody tr').first().within(() => {
        cy.get('td').eq(0).invoke('text').then((plantName) => {
            deletedSaleData.plantName = plantName.trim();
        });
        cy.get('td').eq(1).invoke('text').then((quantity) => {
            deletedSaleData.quantity = quantity.trim();
        });
        cy.get('td').eq(3).invoke('text').then((soldAt) => {
            deletedSaleData.soldAt = soldAt.trim();
        });
    });

    // Confirm deletion
    cy.on('window:confirm', (text) => {
        expect(text).to.include('Are you sure');
        return true;
    });

    cy.get('table tbody tr').first().find('form button, button').first().click();
    cy.wait(1000);
});

Then('I should see success message {string}', (message) => {
    cy.get('.alert.alert-success, .alert-success, [class*="success"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', message);
});

Then('the deleted sale should not be in the table', () => {
    const { plantName, quantity, soldAt } = deletedSaleData;
    cy.get('table tbody').should('not.contain.text', `${plantName}${quantity}${soldAt}`);
});

When('I attempt to delete the first sale and cancel', () => {
    // Capture sale data
    cy.get('table tbody tr').first().within(() => {
        cy.get('td').eq(0).invoke('text').as('plantName_cancel');
        cy.get('td').eq(1).invoke('text').as('quantity_cancel');
        cy.get('td').eq(3).invoke('text').as('soldAt_cancel');
    });

    // Cancel deletion
    cy.on('window:confirm', (text) => {
        expect(text).to.include('Are you sure');
        return false;
    });

    cy.get('table tbody tr').first().find('form button, button').first().click();
    cy.wait(500);
});

Then('the sale should still be in the table', () => {
    cy.get('@plantName_cancel').then((plantName) => {
        cy.get('@quantity_cancel').then((quantity) => {
            cy.get('@soldAt_cancel').then((soldAt) => {
                cy.get('table tbody').should('contain.text', plantName.trim());
                cy.get('table tbody').should('contain.text', quantity.trim());
                cy.get('table tbody').should('contain.text', soldAt.trim());
            });
        });
    });
});

Then('I should not see success message {string}', (message) => {
    cy.get('body').then(($body) => {
        const found = $body.find(`.alert:contains("${message}")`).length > 0;
        expect(found, `"${message}" should not appear`).to.equal(false);
    });
});

// ==================== DROPDOWN VALIDATION ====================

Then('the plant dropdown should list only plants with stock greater than {int}', (minStock) => {
    cy.get('select#plantId option, select[name="plantId"] option').then(($opts) => {
        const options = [...$opts]
            .map((o) => ({ value: o.value, text: o.textContent?.trim() || '' }))
            .filter((o) => o.value); // skip placeholder

        expect(options.length, 'plant options').to.be.greaterThan(0);

        options.forEach((o) => {
            const m = o.text.match(/\(Stock:\s*(\d+)\)/i);
            expect(m, `Stock label missing in: ${o.text}`).to.exist;
            expect(Number(m[1]), `stock must be > ${minStock} in: ${o.text}`).to.be.greaterThan(minStock);
        });
    });
});

Then('each plant option should show stock value', () => {
    cy.get('select#plantId option, select[name="plantId"] option').then(($opts) => {
        const options = [...$opts].filter((o) => o.value);
        options.forEach((o) => {
            expect(o.textContent, 'stock label').to.match(/\(Stock:\s*\d+\)/i);
        });
    });
});
