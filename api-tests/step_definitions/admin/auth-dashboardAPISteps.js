const { Then } = require('@badeball/cypress-cucumber-preprocessor');
const { getApiResponse } = require('../commonSteps');

// Validate admin dashboard statistics
Then('the dashboard response should contain admin statistics', () => {
    const response = getApiResponse();

    // Validate response body contains expected dashboard fields
    expect(response.body).to.have.property('totalCategories');
    expect(response.body).to.have.property('mainCategories');
    expect(response.body).to.have.property('subCategories');
    expect(response.body).to.have.property('totalPlants');
    expect(response.body).to.have.property('lowStockPlants');
    expect(response.body).to.have.property('totalSales');
    expect(response.body).to.have.property('totalRevenue');

    // Validate data types
    expect(response.body.totalCategories).to.be.a('number');
    expect(response.body.mainCategories).to.be.a('number');
    expect(response.body.subCategories).to.be.a('number');
    expect(response.body.totalPlants).to.be.a('number');
    expect(response.body.lowStockPlants).to.be.a('number');
    expect(response.body.totalSales).to.be.a('number');
    expect(response.body.totalRevenue).to.be.a('number');

    // Log actual values for verification
    cy.log('✅ Admin Dashboard Statistics:');
    cy.log(`  Total Categories: ${response.body.totalCategories}`);
    cy.log(`  Main Categories: ${response.body.mainCategories}`);
    cy.log(`  Sub Categories: ${response.body.subCategories}`);
    cy.log(`  Total Plants: ${response.body.totalPlants}`);
    cy.log(`  Low Stock Plants: ${response.body.lowStockPlants}`);
    cy.log(`  Total Sales: ${response.body.totalSales}`);
    cy.log(`  Total Revenue: $${response.body.totalRevenue}`);
});
