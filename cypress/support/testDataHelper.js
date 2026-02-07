/**
 * Test Data Seeding Helper for Plant Management Tests
 * 
 * This file provides utilities to seed the database with test data
 * before running UI and API tests.
 */

/**
 * Seeds plants with specific names for search testing
 * @param {Array<string>} plantNames - Array of plant names to create
 */
export const seedPlantsWithNames = (plantNames) => {
    const apiBaseUrl = Cypress.env('apiBaseUrl') || 'http://localhost:8080';

    // First, get admin token
    cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/api/auth/login`,
        body: {
            username: 'admin',
            password: 'admin123'
        }
    }).then((loginResponse) => {
        const adminToken = loginResponse.body.token;

        // Get categories to assign plants to
        cy.request({
            method: 'GET',
            url: `${apiBaseUrl}/api/categories`,
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        }).then((categoriesResponse) => {
            const categories = categoriesResponse.body;

            if (categories.length === 0) {
                cy.log('⚠ No categories found. Please create categories first.');
                return;
            }

            // Create each plant
            plantNames.forEach((plantName, index) => {
                const categoryId = categories[index % categories.length].id;

                cy.request({
                    method: 'POST',
                    url: `${apiBaseUrl}/api/plants`,
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: {
                        name: plantName,
                        description: `Test plant: ${plantName}`,
                        price: 10 + (index * 5),
                        quantity: 10 + index,
                        categoryId: categoryId
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    if (response.status === 201 || response.status === 200) {
                        cy.log(`✓ Created plant: ${plantName}`);
                    } else {
                        cy.log(`⚠ Failed to create plant: ${plantName} (may already exist)`);
                    }
                });
            });
        });
    });
};

/**
 * Seeds multiple plants with a common name pattern
 * @param {string} baseName - Base name for plants (e.g., "Rose")
 * @param {number} count - Number of plants to create
 */
export const seedPlantsWithPattern = (baseName, count) => {
    const plantNames = [];
    for (let i = 1; i <= count; i++) {
        plantNames.push(`${baseName} ${i}`);
    }
    seedPlantsWithNames(plantNames);
};

/**
 * Deletes all plants (cleanup)
 */
export const deleteAllPlants = () => {
    const apiBaseUrl = Cypress.env('apiBaseUrl') || 'http://localhost:8080';

    cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/api/auth/login`,
        body: {
            username: 'admin',
            password: 'admin123'
        }
    }).then((loginResponse) => {
        const adminToken = loginResponse.body.token;

        // Get all plants
        cy.request({
            method: 'GET',
            url: `${apiBaseUrl}/api/plants`,
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        }).then((plantsResponse) => {
            const plants = plantsResponse.body;

            // Delete each plant
            plants.forEach((plant) => {
                cy.request({
                    method: 'DELETE',
                    url: `${apiBaseUrl}/api/plants/${plant.id}`,
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    },
                    failOnStatusCode: false
                });
            });

            cy.log(`✓ Deleted ${plants.length} plants`);
        });
    });
};
