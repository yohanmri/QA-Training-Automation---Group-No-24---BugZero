/**
 * Test Data Setup Script
 * Run this before executing UI tests to ensure required test data exists
 * 
 * Usage: npx cypress run --spec "cypress/e2e/setup/seedTestData.cy.js"
 */

import { seedPlantsWithNames, seedPlantsWithPattern } from '../../support/testDataHelper';

describe('Seed Test Data for Plant Management Tests', () => {

    it('should seed plants for TC_PLANT_SEARCH_UI_ADMIN_01 (Search by name)', () => {
        cy.log('🌱 Seeding plants with "Tulip" in their names...');
        seedPlantsWithNames(['Tulip', 'Tulip Red', 'Tulip Yellow', 'White Tulip']);
        cy.wait(2000); // Wait for API calls to complete
    });

    it('should seed plants for TC_PLANT_SEARCH_UI_ADMIN_02 (Reset filters)', () => {
        cy.log('🌱 Seeding general plants...');
        seedPlantsWithNames(['Rose', 'Lily', 'Daisy', 'Sunflower', 'Orchid', 'Jasmine']);
        cy.wait(2000);
    });

    it('should seed plants for TC_PLANT_SEARCH_UI_ADMIN_04 (Pagination)', () => {
        cy.log('🌱 Seeding 15 plants with "Rose" in their names...');
        seedPlantsWithPattern('Rose', 15);
        cy.wait(3000); // Wait longer for multiple API calls
    });

    it('should verify seeded data', () => {
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

            cy.request({
                method: 'GET',
                url: `${apiBaseUrl}/api/plants`,
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            }).then((plantsResponse) => {
                const plants = plantsResponse.body;
                cy.log(`✅ Total plants in database: ${plants.length}`);

                const tulipPlants = plants.filter(p => p.name.toLowerCase().includes('tulip'));
                cy.log(`✅ Plants with "Tulip": ${tulipPlants.length}`);

                const rosePlants = plants.filter(p => p.name.toLowerCase().includes('rose'));
                cy.log(`✅ Plants with "Rose": ${rosePlants.length}`);

                // Assertions
                expect(plants.length).to.be.greaterThan(0);
                expect(tulipPlants.length).to.be.greaterThan(0);
                expect(rosePlants.length).to.be.greaterThan(0);
            });
        });
    });
});
