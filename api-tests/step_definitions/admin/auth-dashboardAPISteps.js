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

    cy.log('Admin dashboard statistics validated successfully');
    cy.log(`Dashboard Data: ${JSON.stringify(response.body)}`);
});
