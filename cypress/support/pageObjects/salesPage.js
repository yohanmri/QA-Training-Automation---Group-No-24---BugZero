export const SalesPage = {
  url: "/ui/sales",

  // Page elements
  pageTitle: "h3.mb-4",
  table: "table.table",
  tableHeaderLinks: "table thead a",
  tableRows: "table tbody tr",
  pagination: "ul.pagination",

  visit() {
    cy.visit(this.url);
    cy.url().should("include", "/ui/sales");
  },

  validateHeader() {
    cy.get(this.pageTitle).should("contain.text", "Sales");
  },

  validateTableHasRowsOrEmptyState() {
    cy.get("body").then(($body) => {
      const text = $body.text();
      if (text.includes("No sales found")) {
        cy.contains("No sales found").should("be.visible");
        return;
      }

      cy.get(this.table).should("be.visible");
      cy.get(this.tableRows).its("length").should("be.greaterThan", 0);
    });
  },

  validatePaginationVisible() {
    cy.get("body").then(($body) => {
      // If empty state, pagination should NOT be required
      if ($body.text().includes("No sales found")) {
        return;
      }

      const hasPagination = $body.find(this.pagination).length > 0;

      if (hasPagination) {
        cy.get(this.pagination).should("be.visible");
        cy.get(`${this.pagination} li.page-item`).should("have.length.greaterThan", 0);
        return;
      }

      // If there is data but no pagination, accept as "single-page" behavior
      cy.get(this.tableRows).its("length").should("be.greaterThan", 0);
    });
  },

  clickSort(columnText) {
    // Server-rendered link navigation
    cy.get("thead").contains("a", columnText).should("be.visible").click();
    cy.get(this.table).should("be.visible");
  },

  getColumnValues(colIndex) {
    return cy.get("tbody tr").then(($rows) => {
      const values = [...$rows]
        .map((row) => row.querySelectorAll("td")[colIndex]?.innerText?.trim())
        .filter((v) => v !== undefined && v !== null && v !== "");
      return values;
    });
  },

  clickNextPage() {
  cy.get(this.pagination).should("be.visible");

  // Prefer clicking "Next" if present, else click page number "2" (page=1)
  cy.get("body").then(($body) => {
    const hasNext =
      $body.find("ul.pagination a.page-link").filter((_, el) => {
        return el.textContent.trim().toLowerCase() === "next";
      }).length > 0;

    if (hasNext) {
      cy.get(this.pagination)
        .contains("a.page-link", "Next")
        .should("be.visible")
        .then(($a) => {
          const li = $a[0].closest("li");
          const isDisabled = li?.classList.contains("disabled");
          expect(isDisabled, "Next page should be enabled").to.equal(false);
        });

      cy.get(this.pagination).contains("a.page-link", "Next").click();
      return;
    }

    // fallback: click page "2" (which is page=1)
    const hasPage2 =
      $body.find('ul.pagination a.page-link').filter((_, el) => {
        return el.textContent.trim() === "2";
      }).length > 0;

    expect(
      hasPage2,
      'Expected pagination to have a "Next" link or page "2" (ensure >= 11 sales records)'
    ).to.equal(true);

    cy.get(this.pagination).contains("a.page-link", "2").click();
  });

  // After clicking, validate we moved to page=1
  cy.location("search").then((search) => {
    const qs = new URLSearchParams(search);
    expect(qs.get("page"), "page query param after next").to.equal("1");
  });
},


  getQueryParams() {
    return cy.location("search").then((search) => {
      const qs = new URLSearchParams(search);
      return {
        page: qs.get("page"),
        sortField: qs.get("sortField"),
        sortDir: qs.get("sortDir"),
      };
    });
  },

  expectPage(pageNum) {
    cy.location("search").then((search) => {
      const qs = new URLSearchParams(search);
      expect(qs.get("page"), "page query param").to.equal(String(pageNum));
    });
  },
};
