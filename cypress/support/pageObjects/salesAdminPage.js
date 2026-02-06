// Page Object for Sales Admin functionality
export class SalesAdminPage {
    // Selectors
    static sellPlantBtn() {
        return cy.contains('a', 'Sell Plant').or(cy.contains('button', 'Sell Plant'));
    }

    static actionsHeader() {
        return cy.get('table thead th').contains('Actions');
    }

    static sellPlantHeader() {
        return cy.get('h1, h2, h3').filter(':contains("Sell Plant")');
    }

    static plantSelect() {
        return cy.get('select#plantId, select[name="plantId"]');
    }

    static quantityInput() {
        return cy.get('input#quantity, input[name="quantity"]');
    }

    static sellButton() {
        return cy.contains('button', 'Sell').or(cy.get('button[type="submit"]'));
    }

    static cancelButton() {
        return cy.contains('button', 'Cancel').or(cy.contains('a', 'Cancel'));
    }

    // Navigation
    static visitSales() {
        cy.visit('/ui/sales');
        cy.url().should('include', '/ui/sales');
    }

    static visitSellPlant() {
        cy.visit('/ui/sales/new');
        cy.url().should('include', '/ui/sales/new');
    }

    // Helper methods
    static selectFirstPlantWithStockAtLeast(minStock) {
        return cy.get('select#plantId option').then(($options) => {
            const options = [...$options]
                .map((opt) => ({
                    value: opt.value,
                    text: opt.textContent?.trim() || '',
                }))
                .filter((o) => o.value); // skip placeholder

            for (const option of options) {
                const stockMatch = option.text.match(/\(Stock:\s*(\d+)\)/i);
                if (stockMatch && Number(stockMatch[1]) >= minStock) {
                    cy.get('select#plantId').select(option.value);

                    // Extract plant name (before the stock part)
                    const plantName = option.text.replace(/\s*\(Stock:.*\)/, '').trim();
                    const stock = Number(stockMatch[1]);

                    return cy.wrap({ plantName, stock, plantId: option.value });
                }
            }
            throw new Error(`No plant found with stock >= ${minStock}`);
        });
    }

    static findSaleRow(plantName, quantity) {
        return cy.get('table tbody tr').filter(`:contains("${plantName}")`).filter(`:contains("${quantity}")`);
    }

    static getSalesRowCount() {
        return cy.get('table tbody tr').then(($rows) => $rows.length);
    }
}
