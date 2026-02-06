// Page Object for Plants functionality
export class PlantsPage {
    static visit() {
        cy.visit('/ui/plants');
        cy.url().should('include', '/ui/plants');
    }

    static findPlantByName(plantName) {
        return cy.get('table tbody tr').filter(`:contains("${plantName}")`).then(($row) => {
            if ($row.length === 0) {
                throw new Error(`Plant "${plantName}" not found in table`);
            }

            // Extract stock from the row (assuming it's in a specific column)
            const stockText = $row.find('td').eq(2).text(); // Adjust column index as needed
            const stock = Number(stockText);

            return cy.wrap({ plantName, stock });
        });
    }
}
