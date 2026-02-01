export const PlantsPage = {
  url: "/ui/plants",
  pageTitle: "h3.mb-4",
  tableRows: "table tbody tr",

  visit() {
    cy.visit(this.url);
    cy.url().should("include", this.url);
    cy.get(this.pageTitle).should("contain.text", "Plants");
  },

  findPlantByName(plantName) {
    return cy.get(this.tableRows).then(($rows) => {
      for (const row of $rows) {
        const tds = row.querySelectorAll("td");
        const name = tds[0]?.innerText?.trim();

        if (name === plantName) {
          const stockText = tds[3]?.querySelector("span")?.innerText?.trim();
          const stock = Number(stockText);

          if (Number.isNaN(stock)) {
            throw new Error(`Stock is not a number for plant: ${plantName} (value: ${stockText})`);
          }

          return { stock };
        }
      }

      throw new Error(`Plant row not found for: ${plantName}`);
    });
  },
};
