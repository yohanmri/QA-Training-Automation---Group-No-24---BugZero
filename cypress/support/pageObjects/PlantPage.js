class PlantPage {

  navigateToAddPlant() { cy.visit('/ui/plants/add'); }
  navigateToPlantList() { cy.visit('/ui/plants'); }

 
  fillPlantDetails(name, category, price, qty) {
    cy.get('input[name="name"]').clear().type(name);
    cy.get('select[name="categoryId"]').select(category); 
    cy.get('input[name="price"]').clear().type(price);
    cy.get('input[name="quantity"]').clear().type(qty);
  }

  // Selectors
  get saveBtn() { return cy.contains('button', 'Save'); }
  get searchInput() { return cy.get('input[placeholder="Search plant"]'); }
  get searchBtn() { return cy.get('button').contains('Search'); }
  get plantTable() { return cy.get('table'); }
  get paginationNext() { return cy.get('li.page-item').contains('a.page-link', 'Next'); }

 
  searchPlant(name) {
    this.searchInput.clear().type(name);
    this.searchBtn.click();
    cy.wait(500); 
  }

  // Verification
  verifyPlantInList(name, price, qty) {
    cy.contains('tr', name, { timeout: 10000 }).should('be.visible').within(() => {
      // price might be formatted as 25.50 and so on, so check for the decimal
      cy.get('td').should('contain', price);
      cy.get('td').should('contain', qty);
    });
  }

  clickFirstPlantRow() {
    this.plantTable.find('tbody tr').first().find('td').first().click();
  }
}
export default new PlantPage();