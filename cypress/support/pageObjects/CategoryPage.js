class CategoryPage {
    navigateToList() { cy.visit('/ui/categories'); }
    navigateToAdd() { cy.visit('/ui/categories/add'); }

    get nameInput() { return cy.get('input[name="name"]'); }
    get parentDropdown() { return cy.get('select[name="parentId"]'); }
    get saveBtn() { return cy.contains('button', 'Save'); }
    get categoryTable() { return cy.get('table'); }
    get searchInput() { return cy.get('input[placeholder*="Search"]'); }
    get searchBtn() { return cy.get('button').contains('Search'); }

    fillForm(name, parentText = "Main Category") {
        this.nameInput.clear().type(name);
        if (parentText !== "Main Category") {
            this.parentDropdown.select(parentText);
        }
    }

  
    getEditIcon(name) { 
        return cy.contains('tr', name).find('a.btn-outline-primary'); 
    }

    getDeleteIcon(name) { 
        return cy.contains('tr', name).find('button.btn-outline-danger'); 
    }
}
export default new CategoryPage();