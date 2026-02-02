// api-tests/step_definitions/user/sales-user-api.steps.js

const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");

const { apiRequest, apiLogin, getCredentialsFor } = require("../../support/api-client");
const { assertSaleShape, assertPageSaleSchema } = require("../../support/schema-assertions");

const alias = {
  lastResponse: "lastResponse",
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

function loginAs(role) {
  const creds = getCredentialsFor(role);
  return apiLogin(creds).then((token) =>
    cy
      .wrap(token, { log: false })
      .as(`${role.toLowerCase()}Token`)
      .then(() => token)
  );
}

function getAnyPlantId(token) {
  return apiRequest({
    method: "GET",
    path: "/api/plants",
    token,
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(
        `[SETUP] Expected 200 from GET /api/plants but got ${res.status}. Body: ${JSON.stringify(res.body)}`
      );
    }

    const body = res.body;

    if (Array.isArray(body) && body.length > 0 && body[0]?.id != null) return body[0].id;
    if (body && typeof body === "object" && body.id != null) return body.id;

    throw new Error(`[SETUP] Could not resolve a plantId from GET /api/plants response: ${JSON.stringify(body)}`);
  });
}

function getAnySaleIdOrSeed(userToken) {
  return apiRequest({
    method: "GET",
    path: "/api/sales",
    token: userToken,
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(
        `[SETUP] Expected 200 from GET /api/sales but got ${res.status}. Body: ${JSON.stringify(res.body)}`
      );
    }

    // if any sales exist then use first id
    if (Array.isArray(res.body) && res.body.length > 0 && res.body[0]?.id != null) {
      return res.body[0].id;
    }

    // else seed one sale using admin creds
    const hasAdminCreds = Boolean(Cypress.env("ADMIN_USERNAME") && Cypress.env("ADMIN_PASSWORD"));
    if (!hasAdminCreds) {
      throw new Error(
        `[SETUP] No sales exist to test DELETE /api/sales/{id}. ` +
          `Either seed sales data in DB OR set CYPRESS_ADMIN_USERNAME and CYPRESS_ADMIN_PASSWORD ` +
          `so the test can create one sale as setup.`
      );
    }

    return loginAs("ADMIN")
      .then((adminToken) => getAnyPlantId(adminToken).then((plantId) => ({ adminToken, plantId })))
      .then(({ adminToken, plantId }) =>
        apiRequest({
          method: "POST",
          path: `/api/sales/plant/${plantId}`,
          token: adminToken,
          qs: { quantity: 1 },
          failOnStatusCode: false,
        })
      )
      .then((sellRes) => {
        if (sellRes.status !== 201) {
          throw new Error(
            `[SETUP] Expected 201 from ADMIN sell plant but got ${sellRes.status}. Body: ${JSON.stringify(
              sellRes.body
            )}`
          );
        }
        if (!sellRes.body?.id) {
          throw new Error(`[SETUP] Sale creation response missing id: ${JSON.stringify(sellRes.body)}`);
        }
        return sellRes.body.id;
      });
  });
}

// Step Definitions

When(`I request all sales`, () => {
  return getToken("USER")
    .then((token) =>
      apiRequest({
        method: "GET",
        path: "/api/sales",
        token,
        failOnStatusCode: false,
      })
    )
    .then(setLastResponse);
});

When(`I request paged sales with page {int} and size {int} and sort {string}`, (page, size, sort) => {
  return getToken("USER")
    .then((token) =>
      apiRequest({
        method: "GET",
        path: "/api/sales/page",
        token,
        qs: { page, size, sort },
        failOnStatusCode: false,
      })
    )
    .then(setLastResponse);
});

When(`I request all sales without authentication`, () => {
  return apiRequest({
    method: "GET",
    path: "/api/sales",
    token: null,
    failOnStatusCode: false,
  }).then(setLastResponse);
});

When(`I attempt to sell any available plant with quantity {int} as {string}`, (quantity, role) => {
  const upperRole = role.toUpperCase();

  return getToken(upperRole)
    .then((token) => getAnyPlantId(token).then((plantId) => ({ token, plantId })))
    .then(({ token, plantId }) =>
      apiRequest({
        method: "POST",
        path: `/api/sales/plant/${plantId}`,
        token,
        qs: { quantity },
        failOnStatusCode: false,
      })
    )
    .then(setLastResponse);
});

When(`I attempt to delete any existing sale as {string}`, (role) => {
  const upperRole = role.toUpperCase();

  return getToken(upperRole)
    .then((token) => getAnySaleIdOrSeed(token).then((saleId) => ({ token, saleId })))
    .then(({ token, saleId }) =>
      apiRequest({
        method: "DELETE",
        path: `/api/sales/${saleId}`,
        token,
        failOnStatusCode: false,
      })
    )
    .then(setLastResponse);
});

Then(`the response should be a JSON array of Sale objects`, () => {
  return getLastResponse().then((res) => {
    expect(res.headers).to.have.property("content-type");
    expect(res.headers["content-type"]).to.include("application/json");

    expect(res.body).to.be.an("array");
    res.body.forEach(assertSaleShape);
  });
});

Then(`the response should match the PageSale schema with max page size {int}`, (maxSize) => {
  return getLastResponse().then((res) => {
    expect(res.headers["content-type"]).to.include("application/json");
    assertPageSaleSchema(res.body, maxSize);

    const dates = res.body.content.map((s) => new Date(s.soldAt).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).to.be.at.most(dates[i - 1]);
    }
  });
});

Then(`the response should contain an authorization error message`, () => {
  return getLastResponse().then((res) => {
    if (res.body && typeof res.body === "object" && "message" in res.body) {
      expect(String(res.body.message).toLowerCase()).to.include("forbidden");
      return;
    }

    expect(res.body).to.not.have.property("soldAt");
  });
});
