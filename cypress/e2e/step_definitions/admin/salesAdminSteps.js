import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { SalesAdminPage } from "../../../support/pageObjects/salesAdminPage";
import { PlantsPage } from "../../../support/pageObjects/plantsPage";

// -------------------- Navigation (Admin-only wording) --------------------
Given('admin navigates to the {string} page', (pageName) => {
  if (pageName === "Sales") return SalesAdminPage.visitSales();
  if (pageName === "Plants") return PlantsPage.visit();
  throw new Error(`Unsupported page name: ${pageName}`);
});

When("admin navigates to Sell Plant page", () => {
  SalesAdminPage.visitSellPlant();
});

Then("admin should be redirected to {string}", (expectedPath) => {
  cy.url().should("include", expectedPath);
});

// -------------------- UI checks --------------------
Then('validate "Sell Plant" button is visible and enabled', () => {
  SalesAdminPage.sellPlantBtn().should("be.visible").and("not.be.disabled");
});

Then("validate sales actions column is visible", () => {
  SalesAdminPage.actionsHeader().should("be.visible");
});

Then("validate Sell Plant form is displayed", () => {
  SalesAdminPage.sellPlantHeader().should("contain.text", "Sell Plant");
  SalesAdminPage.plantSelect().should("be.visible");
  SalesAdminPage.quantityInput().should("be.visible");
  SalesAdminPage.sellButton().should("be.visible");
  SalesAdminPage.cancelButton().should("be.visible");
});

// -------------------- Form interactions --------------------
When("admin leaves plant unselected", () => {
  SalesAdminPage.plantSelect().select("");
});

When('admin enters quantity {string}', (qty) => {
  SalesAdminPage.quantityInput().clear().type(qty);
});

When("admin clicks Sell button", () => {
  SalesAdminPage.sellButton().click();
});

When("admin clicks Cancel button", () => {
  SalesAdminPage.cancelButton().click();
});

When("admin selects the first plant with stock at least 1", () => {
  SalesAdminPage.selectFirstPlantWithStockAtLeast(1).as("selectedPlant");
});

// -------------------- Validation assertions --------------------
Then('validate text {string} is displayed', (text) => {
  cy.contains(text).should("be.visible");
});

Then("validate quantity input is invalid", () => {
  SalesAdminPage.quantityInput().then(($el) => {
    expect($el[0].checkValidity(), "quantity should be invalid").to.equal(false);
  });
});

// -------------------- Sale assertions --------------------
Then('validate newly created sale row exists for selected plant and quantity {string}', (qty) => {
  cy.get("@selectedPlant").then(({ plantName }) => {
    SalesAdminPage.findSaleRow(plantName, qty).should("have.length.greaterThan", 0);
  });
});

// -------------------- Stock reduction --------------------
Then('validate selected plant stock is reduced by {string}', (deltaStr) => {
  const delta = Number(deltaStr);

  cy.get("@selectedPlant").then(({ plantName, stock }) => {
    PlantsPage.findPlantByName(plantName).then(({ stock: stockAfter }) => {
      expect(stockAfter).to.equal(stock - delta);
    });
  });
});

// -------------------- Cancel scenario row count --------------------
When("admin captures current sales row count", () => {
  SalesAdminPage.getSalesRowCount().as("salesRowCountBefore");
});

Then("validate sales row count is unchanged", () => {
  cy.get("@salesRowCountBefore").then((beforeCount) => {
    SalesAdminPage.getSalesRowCount().then((afterCount) => {
      expect(afterCount).to.equal(beforeCount);
    });
  });
});

// -------------------- Delete scenario --------------------
When("admin deletes the first sale after confirming", () => {
  // Capture row fingerprint
  cy.get("table tbody tr")
    .first()
    .within(() => {
      cy.get("td").eq(0).invoke("text").as("plantName");
      cy.get("td").eq(1).invoke("text").as("quantity");
      cy.get("td").eq(3).invoke("text").as("soldAt");
    });

  cy.on("window:confirm", (text) => {
    expect(text).to.eq("Are you sure you want to delete this sale?");
    return true;
  });

  cy.get("table tbody tr")
    .first()
    .find("form button")
    .click();

  cy.location("pathname", { timeout: 10000 })
    .should("include", "/ui/sales");
});


Then('validate sale deleted success alert is displayed', () => {
  cy.get('.alert.alert-success', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      cy.contains('Sale deleted successfully').should('be.visible');
    });
});


Then("validate the sale record is removed from the list", () => {
  cy.get("@plantName").then((plant) => {
    cy.get("@quantity").then((qty) => {
      cy.get("@soldAt").then((date) => {
        cy.get("table tbody").should(
          "not.contain.text",
          `${plant}${qty}${date}`
        );
      });
    });
  });
});

