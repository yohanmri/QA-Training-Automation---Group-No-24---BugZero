// api-tests/step_definitions/admin/sales-admin-api.steps.js
const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");
const { apiRequest } = require("../../support/api-client");
const { assertSaleShape } = require("../../support/schema-assertions");

/* -------------------------
   Aliases + helpers
-------------------------- */

const alias = {
  lastResponse: "lastResponse",
  plantId: "plantId",
  qtyBefore: "qtyBefore",
  deletedSaleId: "deletedSaleId",
};

function setLastResponse(res) {
  return cy.wrap(res, { log: false }).as(alias.lastResponse);
}

function getLastResponse() {
  return cy.get(`@${alias.lastResponse}`);
}

function getToken(role) {
  return cy.get(`@${role.toLowerCase()}Token`);
}

function resolvePlantQuantity(plant) {
  return plant?.quantity ?? plant?.stock ?? plant?.availableQuantity;
}

function getPlants(token) {
  return apiRequest({
    method: "GET",
    path: "/api/plants",
    token,
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status, "GET /api/plants status").to.equal(200);

    if (Array.isArray(res.body)) return res.body;
    if (res.body && typeof res.body === "object") return [res.body];
    return [];
  });
}

function getPlantById(token, plantId) {
  return apiRequest({
    method: "GET",
    path: `/api/plants/${plantId}`,
    token,
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status, `GET /api/plants/${plantId} status`).to.equal(200);
    return res.body;
  });
}

function findPlantWithMinStock(plants, minStock) {
  return plants.find((p) => {
    const qty = resolvePlantQuantity(p);
    return p?.id != null && typeof qty === "number" && qty >= minStock;
  });
}

function sellPlant(token, plantId, quantity) {
  return apiRequest({
    method: "POST",
    path: `/api/sales/plant/${plantId}`,
    token,
    qs: { quantity },
    failOnStatusCode: false,
  });
}

function getSales(token) {
  return apiRequest({
    method: "GET",
    path: "/api/sales",
    token,
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status, "GET /api/sales status").to.equal(200);
    return Array.isArray(res.body) ? res.body : [];
  });
}

function getSaleById(token, saleId) {
  return apiRequest({
    method: "GET",
    path: `/api/sales/${saleId}`,
    token,
    failOnStatusCode: false,
  });
}

function getNonExistentPlantId(token) {
  return getPlants(token).then((plants) => {
    const ids = plants.map((p) => p?.id).filter((id) => id != null);

    if (ids.length === 0) return 99999999;

    const sample = ids[0];
    if (typeof sample === "number") {
      const maxId = Math.max(...ids.filter((x) => typeof x === "number"));
      return maxId + 999999;
    }

    return `${String(sample)}-does-not-exist`;
  });
}

function createSaleIfNone(token) {
  return getSales(token).then((sales) => {
    if (sales.length > 0 && sales[0]?.id != null) return sales[0].id;

    return getPlants(token).then((plants) => {
      const plant = findPlantWithMinStock(plants, 1);
      if (!plant) {
        throw new Error("[SETUP] No plant with stock >= 1 available to create a sale for deletion test.");
      }

      return sellPlant(token, plant.id, 1).then((sellRes) => {
        expect(sellRes.status, "seed sale status").to.equal(201);
        expect(sellRes.body?.id, "seed sale id").to.exist;
        return sellRes.body.id;
      });
    });
  });
}

// Step Definitions

/* TC_SALES_API_ADMIN_01 */

When(`I sell an existing plant as {string} with quantity {int}`, (role, quantity) => {
  const upperRole = role.toUpperCase();

  return getToken(upperRole)
    .then((token) => getPlants(token).then((plants) => ({ token, plants })))
    .then(({ token, plants }) => {
      const plant = findPlantWithMinStock(plants, 1);
      if (!plant) throw new Error("[SETUP] No plant with stock >= 1 found for selling.");

      return sellPlant(token, plant.id, quantity).then(setLastResponse);
    });
});

/* TC_SALES_API_ADMIN_02 */
When(
  `I sell a plant with stock at least {int} as {string} with quantity {int}`,
  (minStock, role, quantity) => {
    const upperRole = role.toUpperCase();

    return getToken(upperRole)
      .then((token) => getPlants(token).then((plants) => ({ token, plants })))
      .then(({ token, plants }) => {
        const plant = findPlantWithMinStock(plants, minStock);
        if (!plant) throw new Error(`[SETUP] No plant with stock >= ${minStock} found. Seed data and re-run.`);

        return cy
          .wrap(plant.id, { log: false })
          .as(alias.plantId)
          .then(() => getPlantById(token, plant.id))
          .then((beforePlant) => cy.wrap(resolvePlantQuantity(beforePlant), { log: false }).as(alias.qtyBefore))
          .then(() => sellPlant(token, plant.id, quantity))
          .then(setLastResponse);
      });
  }
);

/* TC_SALES_API_ADMIN_04 */
When(`I sell a non-existent plant as {string} with quantity {int}`, (role, quantity) => {
  const upperRole = role.toUpperCase();

  return getToken(upperRole)
    .then((token) => getNonExistentPlantId(token).then((badId) => ({ token, badId })))
    .then(({ token, badId }) => sellPlant(token, badId, quantity))
    .then(setLastResponse);
});

/* TC_SALES_API_ADMIN_05 */
When(`I delete an existing sale as {string}`, (role) => {
  const upperRole = role.toUpperCase();

  return getToken(upperRole)
    .then((token) => createSaleIfNone(token).then((saleId) => ({ token, saleId })))
    .then(({ token, saleId }) =>
      cy
        .wrap(saleId, { log: false })
        .as(alias.deletedSaleId)
        .then(() =>
          apiRequest({
            method: "DELETE",
            path: `/api/sales/${saleId}`,
            token,
            failOnStatusCode: false,
          })
        )
    )
    .then(setLastResponse);
});

/* Admin-only Thens */
Then(`the response should be a Sale object with quantity {int}`, (expectedQty) => {
  return getLastResponse().then((res) => {
    expect(res.headers["content-type"]).to.include("application/json");
    assertSaleShape(res.body);
    expect(res.body.quantity).to.equal(expectedQty);
  });
});

Then(`the plant stock should be reduced by 1`, () => {
  return getToken("ADMIN").then((token) => {
    return cy.get(`@${alias.plantId}`).then((plantId) => {
      return cy.get(`@${alias.qtyBefore}`).then((qtyBefore) => {
        return getPlantById(token, plantId).then((afterPlant) => {
          const qtyAfter = resolvePlantQuantity(afterPlant);
          expect(qtyAfter).to.equal(qtyBefore - 1);
        });
      });
    });
  });
});

Then(`the deleted sale should not be retrievable`, () => {
  return getToken("ADMIN").then((token) => {
    return cy.get(`@${alias.deletedSaleId}`).then((saleId) => {
      return getSaleById(token, saleId).then((res) => {
        expect(res.status).to.equal(404);
      });
    });
  });
});
