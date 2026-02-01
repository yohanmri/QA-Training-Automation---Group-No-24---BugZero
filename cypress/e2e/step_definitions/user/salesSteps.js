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
