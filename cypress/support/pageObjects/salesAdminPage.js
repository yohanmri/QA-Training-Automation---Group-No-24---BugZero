export const SalesAdminPage = {
  salesUrl: "/ui/sales",
  sellPlantUrl: "/ui/sales/new",

  // Sales list
  salesHeader: "h3.mb-4",
  sellPlantButton: 'a.btn.btn-primary.btn-sm',
  actionsTh: "table thead th",
  tableRows: "table tbody tr",

  // Sell Plant form
  sellPlantHeaderSel: "h3.mb-4",
  plantSelectSel: "#plantId",
  quantityInputSel: "#quantity",
  sellBtnSel: "form button.btn.btn-primary",
  cancelBtnSel: 'form a.btn.btn-secondary',

  visitSales() {
    cy.visit(this.salesUrl);
    cy.url().should("include", this.salesUrl);
    cy.get(this.salesHeader).should("contain.text", "Sales");
  },

  visitSellPlant() {
    cy.visit(this.sellPlantUrl);
    cy.url().should("include", this.sellPlantUrl);
    cy.get(this.sellPlantHeaderSel).should("contain.text", "Sell Plant");
  },

  sellPlantBtn() {
    return cy.contains(this.sellPlantButton, "Sell Plant");
  },

  actionsHeader() {
    return cy.contains(this.actionsTh, "Actions");
  },

  plantSelect() {
    return cy.get(this.plantSelectSel);
  },

  quantityInput() {
    return cy.get(this.quantityInputSel);
  },

  sellButton() {
    return cy.get(this.sellBtnSel);
  },

  cancelButton() {
    return cy.get(this.cancelBtnSel);
  },


  selectFirstPlantWithStockAtLeast(minStock) {
    return cy.get(`${this.plantSelectSel} option`).then(($opts) => {
      const options = [...$opts]
        .map((o) => ({
          value: o.getAttribute("value"),
          text: o.textContent?.trim() || "",
        }))
        .filter((o) => o.value);

      const picked = options
        .map((o) => {
          const m = o.text.match(/^(.+?)\s*\(Stock:\s*(\d+)\)\s*$/i);
          if (!m) return null;
          return { value: o.value, plantName: m[1].trim(), stock: Number(m[2]) };
        })
        .filter(Boolean)
        .find((o) => o.stock >= minStock);

      expect(picked, `No plant option with stock >= ${minStock}`).to.exist;

      // queue Cypress select command
      cy.get(this.plantSelectSel).select(picked.value);

      return cy.wrap(
        { plantName: picked.plantName, stock: picked.stock, value: picked.value },
        { log: false }
      );
    });
  },

  findSaleRow(plantName, qty) {
    return cy.get(this.tableRows).filter((_, row) => {
      const tds = row.querySelectorAll("td");
      const plant = tds[0]?.innerText?.trim();
      const quantity = tds[1]?.innerText?.trim();
      return plant === plantName && quantity === String(qty);
    });
  },

  getSalesRowCount() {
    cy.get("h3.mb-4").should("contain.text", "Sales"); // ensure page loaded
    return cy.get("body").then(($body) => {
      const rows = $body.find("table tbody tr");
      return rows.length;
    });
  },

  getFirstDeleteAction() {
    return cy
      .get(this.tableRows)
      .first()
      .find('form[action*="/ui/sales/delete/"]')
      .invoke("attr", "action");
  },

  clickDeleteOnFirstRow() {
    cy.get(this.tableRows)
      .first()
      .find('form[action*="/ui/sales/delete/"] button')
      .click();
  },

  isDeleteActionPresent(action) {
    return cy.get("body").then(($b) => {
      const exists = $b.find(`form[action="${action}"]`).length > 0;
      return cy.wrap(exists, { log: false });
    });
  },

  sellPlantHeader() {
    return cy.get(this.sellPlantHeaderSel);
  },

  waitForDeleteActionToDisappear(action) {
    cy.get("body", { timeout: 10000 }).should(($body) => {
        const exists = $body.find(`form[action="${action}"]`).length > 0;
        expect(exists, `delete form should be gone: ${action}`).to.equal(false);
    });
  },
};
