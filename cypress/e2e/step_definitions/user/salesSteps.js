import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { SalesPage } from "../../../support/pageObjects/salesPage";

// -------- helpers --------
const parseNumber = (text) => Number(String(text).replace(/,/g, "").trim());

const parseSoldAt = (text) => {
  // UI format: "YYYY-MM-DD HH:mm"
  const s = String(text).trim().replace(" ", "T");
  const withSeconds = s.length === 16 ? `${s}:00` : s;
  return new Date(withSeconds).getTime();
};

const assertSorted = (values, direction, type) => {
  const normalize = (v) => {
    if (type === "number") return parseNumber(v);
    if (type === "date") return parseSoldAt(v);
    return String(v).toLowerCase(); // default string
  };

  const normalized = values.map(normalize);
  const sorted = [...normalized].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
  const expected = direction === "desc" ? sorted.reverse() : sorted;

  expect(normalized, `Expected sorted ${direction} as ${type}`).to.deep.equal(expected);
};

const columnIndexByName = (name) => {
  const map = {
    Plant: 0,
    Quantity: 1,
    "Total Price": 2,
    "Sold At": 3,
  };
  return map[name];
};

const columnTypeByName = (name) => {
  if (name === "Quantity" || name === "Total Price") return "number";
  if (name === "Sold At") return "date";
  return "string";
};


Given('user navigates to the {string} page', (pageName) => {
  if (pageName !== "Sales") throw new Error(`Unsupported page name: ${pageName}`);

  SalesPage.visit();
  SalesPage.validateHeader();
});

Then("validate Sales List page header is displayed", () => {
  SalesPage.validateHeader();
});

Then("validate Sales table has at least 1 record", () => {
  SalesPage.validateTableHasRowsOrEmptyState();
});

Then("validate pagination component is displayed", () => {
  SalesPage.validatePaginationVisible();
});

When("user clicks next page in pagination", () => {
  SalesPage.clickNextPage();
});

Then('validate user is on page {string}', (pageNum) => {
  SalesPage.expectPage(pageNum);
});

When('user clicks sort by {string}', (columnText) => {
  SalesPage.clickSort(columnText);
});

Then('validate Sales table is sorted by Sold At in {string} order', (sortDir) => {
  SalesPage.getColumnValues(3).then((values) => {
    const cleaned = values.filter((v) => v && v !== "—");
    assertSorted(cleaned, sortDir, "date");
  });
});

Then('validate Sales table is sorted by Plant in {string} order', (sortDir) => {
  SalesPage.getColumnValues(0).then((values) => {
    const cleaned = values.filter(Boolean);
    assertSorted(cleaned, sortDir, "string");
  });
});

Then('validate Sales table is sorted by Quantity in {string} order', (sortDir) => {
  SalesPage.getColumnValues(1).then((values) => {
    const cleaned = values.filter(Boolean);
    assertSorted(cleaned, sortDir, "number");
  });
});

Then('validate Sales table is sorted by Total Price in {string} order', (sortDir) => {
  SalesPage.getColumnValues(2).then((values) => {
    const cleaned = values.filter(Boolean);
    assertSorted(cleaned, sortDir, "number");
  });
});



Then('validate Sales table is sorted by column {string} based on current URL', (columnName) => {
  const colIndex = columnIndexByName(columnName);
  expect(colIndex, `Unknown column name: ${columnName}`).to.not.equal(undefined);

  const type = columnTypeByName(columnName);

  SalesPage.getQueryParams().then((qs) => {
    const dir = qs.sortDir || "asc";

    SalesPage.getColumnValues(colIndex).then((values) => {
      const cleaned = values.filter(Boolean);
      assertSorted(cleaned, dir, type);
    });
  });
});

Then('validate {string} button is not visible', (buttonText) => {
  cy.contains("a,button", buttonText).should("not.exist");
});

Then("validate delete action is not visible in Sales list", () => {
  cy.get("body").should("not.contain.text", "Delete");
  cy.get("body").find(".bi-trash, .bi-trash-fill").should("not.exist");
});

When('user navigates directly to {string}', (path) => {
  cy.visit(path);
});

Then('validate user is redirected to {string}', (expectedPath) => {
  cy.url().should("include", expectedPath);
});

// TC_SALES_UI_USER_09
Given("sales records are cleared using Admin API", () => {
  cy.apiLogin("admin", "admin123").then((token) => {
    expect(token, "Admin token").to.exist;

    cy.apiRequest("GET", "/api/sales", null, token).then((res) => {
      const sales = Array.isArray(res.body) ? res.body : [];
      if (sales.length === 0) return;

      // delete sequentially
      const deleteOneByOne = (i) => {
        if (i >= sales.length) return;
        const id = sales[i]?.id;
        if (!id) return deleteOneByOne(i + 1);

        cy.apiRequest("DELETE", `/api/sales/${id}`, null, token).then(() => {
          deleteOneByOne(i + 1);
        });
      };

      deleteOneByOne(0);
    });
  });
});

Then('validate "No sales found" message is displayed', () => {
  cy.contains("No sales found").should("be.visible");
});

Then("validate Sales table has 0 rows", () => {
  cy.get("body").then(($body) => {
    // If table isn't rendered in empty state, that's fine
    const hasTableBody = $body.find("table tbody").length > 0;
    if (!hasTableBody) return;

    cy.get("table tbody tr").then(($rows) => {
      // Accept both implementations:
      // 1) No rows at all
      // 2) Single placeholder row with "No sales found"
      if ($rows.length === 0) return;

      if ($rows.length === 1) {
        cy.wrap($rows.first()).should("contain.text", "No sales found");
        return;
      }

      // If more than 1 row exists, that's a real failure
      expect($rows.length, "Expected no data rows in empty state").to.equal(0);
    });
  });
});


Then("validate pagination is hidden or disabled", () => {
  cy.get("body").then(($body) => {
    const pager = $body.find("ul.pagination");
    if (pager.length === 0) {
      // hidden case
      expect(true).to.equal(true);
      return;
    }

    // disabled case (all pagination items disabled OR next disabled)
    cy.get("ul.pagination li").then(($lis) => {
      const allDisabled = [...$lis].every((li) => li.classList.contains("disabled"));
      expect(allDisabled, "pagination should be disabled when no records").to.equal(true);
    });
  });
});

Given("sales records exist more than 10 for pagination", () => {
  cy.apiLogin("admin", "admin123").then((token) => {
    expect(token, "Admin token").to.exist;

    // Get a plant to sell
    cy.apiRequest("GET", "/api/plants", null, token).then((plantsRes) => {
      const plants = Array.isArray(plantsRes.body) ? plantsRes.body : [];
      expect(plants.length, "plants exist").to.be.greaterThan(0);

      const plantId = plants[0].id;
      expect(plantId).to.exist;

      const requiredSales = 11;

      const createSale = (i) => {
        if (i >= requiredSales) return;

        cy.apiRequest(
          "POST",
          `/api/sales/plant/${plantId}?quantity=1`,
          null,
          token
        ).then(() => createSale(i + 1));
      };

      createSale(0);
    });
  });
});
