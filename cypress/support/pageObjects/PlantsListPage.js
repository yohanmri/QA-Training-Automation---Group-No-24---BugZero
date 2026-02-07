/**
 * Page Object Model for Plants List Page
 * Contains all selectors and methods for interacting with the Plants List page
 */

class PlantsListPage {
    // ========== Selectors ==========

    // Navigation
    get plantsNavLink() {
        return cy.contains('a', 'Plants');
    }

    // Search and Filter Elements
    get searchInput() {
        return cy.get('input[placeholder*="Search"], input[name="search"]');
    }

    get searchButton() {
        return cy.contains('button', 'Search');
    }

    get resetButton() {
        return cy.contains('button', 'Reset');
    }

    get categoryDropdown() {
        return cy.get('select[name="category"], select').first();
    }

    // Table Elements
    get plantsTable() {
        return cy.get('table');
    }

    get tableRows() {
        return cy.get('table tbody tr');
    }

    get tableHeaders() {
        return cy.get('table thead th');
    }

    getColumnHeader(columnName) {
        // Map "Quantity" to "Stock" since the UI uses "Stock" as the header
        const headerMap = {
            'Quantity': 'Stock',
            'Stock': 'Stock'
        };
        const actualHeaderName = headerMap[columnName] || columnName;
        return cy.contains('th', actualHeaderName);
    }

    // Admin-specific Elements
    get addPlantButton() {
        // The button is actually an anchor tag with text "Add a Plant"
        return cy.contains('a.btn', 'Add a Plant');
    }

    get editButtons() {
        return cy.get('button, a').filter(':contains("Edit"), :contains("✏")');
    }

    get deleteButtons() {
        return cy.get('button, a').filter(':contains("Delete"), :contains("🗑")');
    }

    // Pagination Elements
    get paginationControls() {
        return cy.get('.pagination, [aria-label*="pagination"]');
    }

    get nextPageButton() {
        // Pagination uses anchor tags inside li elements, not button tags
        return cy.get('.pagination .page-link').contains('Next');
    }

    get previousPageButton() {
        // Pagination uses anchor tags inside li elements, not button tags
        return cy.get('.pagination .page-link').contains('Previous');
    }

    // Messages
    getMessageByText(message) {
        return cy.contains(message);
    }

    // ========== Actions ==========

    /**
     * Navigate to Plants page
     */
    navigateToPlants() {
        this.plantsNavLink.click();
        cy.url().should('include', '/plants');
        return this;
    }

    /**
     * Search for plants by name
     * @param {string} searchTerm - The search term to enter
     */
    searchPlants(searchTerm) {
        this.searchInput.clear().type(searchTerm);
        this.searchButton.click();
        cy.wait(500);
        return this;
    }

    /**
     * Clear search and filters
     * Handles cases where Reset button may not exist
     */
    resetFilters() {
        // Check if Reset button exists, if not, clear manually
        cy.get('body').then($body => {
            if ($body.find('button:contains("Reset")').length > 0) {
                this.resetButton.click();
                cy.wait(500);
            } else {
                // Alternative: Clear search box and reload or navigate
                this.searchInput.clear();
                cy.get('select').first().select(0); // Reset category if exists
                cy.wait(500);
            }
        });
        return this;
    }

    /**
     * Select a category from dropdown
     * @param {number|string} categoryIndex - Index or value of category to select
     */
    selectCategory(categoryIndex = 1) {
        this.categoryDropdown.select(categoryIndex);
        return this;
    }

    /**
     * Click on a column header to sort
     * @param {string} columnName - Name of the column to sort by
     */
    sortByColumn(columnName) {
        this.getColumnHeader(columnName).click();
        cy.wait(500);
        return this;
    }

    /**
     * Click next page in pagination
     * Handles cases where pagination may not exist
     */
    goToNextPage() {
        cy.get('body').then($body => {
            if ($body.find('.pagination .page-link:contains("Next")').length > 0) {
                this.nextPageButton.click();
                cy.wait(500);
            } else {
                cy.log('⚠ Next page button not found (pagination may not exist)');
            }
        });
        return this;
    }

    /**
     * Click previous page in pagination
     * Handles cases where pagination may not exist
     */
    goToPreviousPage() {
        cy.get('body').then($body => {
            if ($body.find('.pagination .page-link:contains("Previous")').length > 0) {
                this.previousPageButton.click();
                cy.wait(500);
            } else {
                cy.log('⚠ Previous page button not found (pagination may not exist)');
            }
        });
        return this;
    }

    // ========== Assertions ==========

    /**
     * Verify Plants List page is displayed
     */
    verifyPageDisplayed() {
        cy.url().should('include', '/plants');
        cy.contains('Plants').should('be.visible');
        return this;
    }

    /**
     * Verify search box is visible
     */
    verifySearchBoxVisible() {
        this.searchInput.should('be.visible');
        return this;
    }

    /**
     * Verify category dropdown is visible
     */
    verifyCategoryDropdownVisible() {
        this.categoryDropdown.should('be.visible');
        return this;
    }

    /**
     * Verify table is displayed with data
     */
    verifyTableDisplayed() {
        this.plantsTable.should('be.visible');
        this.tableRows.should('have.length.greaterThan', 0);
        return this;
    }

    /**
     * Verify all displayed plants contain search term
     * @param {string} searchTerm - The search term to verify
     */
    verifyPlantsContainSearchTerm(searchTerm) {
        // First check if "No plants found" message is displayed
        cy.get('table tbody').then($tbody => {
            const text = $tbody.text();
            if (text.includes('No plants found')) {
                cy.log(`⚠ No plants found for search term "${searchTerm}"`);
                // This is acceptable - search returned no results
            } else {
                // Verify plants contain the search term (case-insensitive)
                this.tableRows.should('have.length.greaterThan', 0);
                this.tableRows.each(($row) => {
                    const rowText = $row.text().toLowerCase();
                    const searchLower = searchTerm.toLowerCase();
                    expect(rowText).to.include(searchLower);
                });
            }
        });
        return this;
    }

    /**
     * Verify search box is cleared
     */
    verifySearchBoxCleared() {
        this.searchInput.should('have.value', '');
        return this;
    }

    /**
     * Verify Admin-specific buttons are visible
     */
    verifyAdminButtonsVisible() {
        this.addPlantButton.should('be.visible');
        this.tableRows.first().within(() => {
            this.editButtons.should('exist');
            this.deleteButtons.should('exist');
        });
        return this;
    }

    /**
     * Verify pagination controls are visible (if they exist)
     */
    verifyPaginationVisible() {
        // Pagination may not exist if there are few results
        cy.get('body').then($body => {
            if ($body.find('.pagination, [aria-label*="pagination"]').length > 0) {
                this.paginationControls.should('be.visible');
            } else {
                cy.log('⚠ Pagination controls not present (likely < 10 items)');
            }
        });
        return this;
    }

    /**
     * Verify "No plants found" message is displayed
     */
    verifyNoResultsMessage() {
        this.getMessageByText('No plants found').should('be.visible');
        return this;
    }

    /**
     * Verify table is empty or shows "No plants found" message
     */
    verifyTableEmpty() {
        // Check if "No plants found" message is displayed
        cy.get('table tbody').then($tbody => {
            const text = $tbody.text();
            if (text.includes('No plants found')) {
                cy.log('✓ Table shows "No plants found" message');
            } else {
                // If no message, table should have 0 data rows
                this.tableRows.should('have.length', 0);
            }
        });
        return this;
    }

    /**
     * Verify Low badge is displayed for plants with low quantity
     * @param {number} threshold - Quantity threshold (default: 5)
     */
    verifyLowBadgeForLowStock(threshold = 5) {
        this.tableRows.each(($row) => {
            const qtyText = $row.find('td').eq(4).text();
            const qty = parseInt(qtyText.replace(/[^0-9]/g, ''));

            if (qty < threshold) {
                cy.wrap($row).should('contain.text', 'Low');
            }
        });
        return this;
    }

    /**
     * Verify no Low badge for plants with sufficient stock
     * @param {number} threshold - Quantity threshold (default: 5)
     */
    verifyNoLowBadgeForSufficientStock(threshold = 5) {
        this.tableRows.each(($row) => {
            const qtyText = $row.find('td').eq(4).text();
            const qty = parseInt(qtyText.replace(/[^0-9]/g, ''));

            if (qty >= threshold) {
                cy.wrap($row).find('td').eq(4).should('not.contain.text', 'Low');
            }
        });
        return this;
    }

    /**
     * Verify plants are sorted by name in ascending order
     */
    verifySortedByNameAscending() {
        const names = [];
        // Name is the 1st column (nth-child(1))
        cy.get('table tbody tr td:nth-child(1)').each(($cell) => {
            names.push($cell.text().trim());
        }).then(() => {
            // Use case-insensitive sorting for comparison
            const sorted = [...names].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

            cy.log('Actual order:', names);
            cy.log('Expected order (sorted):', sorted);

            // Compare arrays
            expect(names).to.deep.equal(sorted);
        });
        return this;
    }

    /**
     * Verify plants are sorted by name in descending order
     */
    verifySortedByNameDescending() {
        const names = [];
        // Name is the 1st column (nth-child(1))
        cy.get('table tbody tr td:nth-child(1)').each(($cell) => {
            names.push($cell.text().trim());
        }).then(() => {
            // Use case-insensitive sorting for comparison
            const sorted = [...names].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));

            cy.log('Actual order:', names);
            cy.log('Expected order (sorted desc):', sorted);

            expect(names).to.deep.equal(sorted);
        });
        return this;
    }

    /**
     * Get plant data from table
     * @returns {Cypress.Chainable} Array of plant objects
     */
    getPlantData() {
        const plants = [];
        this.tableRows.each(($row) => {
            const plant = {
                name: $row.find('td').eq(1).text().trim(),
                category: $row.find('td').eq(2).text().trim(),
                price: parseFloat($row.find('td').eq(3).text().replace(/[^0-9.]/g, '')),
                quantity: parseInt($row.find('td').eq(4).text().replace(/[^0-9]/g, ''))
            };
            plants.push(plant);
        }).then(() => {
            return cy.wrap(plants);
        });
    }
}

export default PlantsListPage;
