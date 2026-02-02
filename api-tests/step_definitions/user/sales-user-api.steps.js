// api-tests/step_definitions/user/sales-user-api.steps.js

const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

const { apiRequest, apiLogin, getCredentialsFor } = require("../../support/api-client");
const {
  assertErrorResponseSchema,
  assertSaleShape,
  assertPageSaleSchema,
} = require("../../support/schema-assertions");


function setLastResponse(res) {
  cy.wrap(res, { log: false }).as("lastResponse");
}

function getLastResponse() {
  return cy.get("@lastResponse");
}

function loginAs(role) {
  const creds = getCredentialsFor(role);

  return apiLogin(creds).then((token) => {
    return cy
      .wrap(token, { log: false })
      .as(`${role.toLowerCase()}Token`)
      .then(() => token);
  });
}


function getToken(role) {
  return cy.get(`@${role.toLowerCase()}Token`);
}

function getAnyPlantId(userToken) {

  return apiRequest({
    method: "GET",
    path: "/api/plants",
    token: userToken,
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(
        `[SETUP] Expected 200 from GET /api/plants but got ${res.status}. ` +
          `Body: ${JSON.stringify(res.body)}`
      );
    }

    const body = res.body;

    if (Array.isArray(body) && body.length > 0 && body[0]?.id != null) {
      return body[0].id;
    }

    if (body && typeof body === "object" && body.id != null) {
      return body.id;
    }

    throw new Error(
      `[SETUP] Could not resolve a plantId from GET /api/plants response: ${JSON.stringify(body)}`
    );
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
        `[SETUP] Expected 200 from GET /api/sales but got ${res.status}. ` +
          `Body: ${JSON.stringify(res.body)}`
      );
    }

    if (Array.isArray(res.body) && res.body.length > 0 && res.body[0]?.id != null) {
      return res.body[0].id;
    }

    const hasAdminCreds = Boolean(Cypress.env("ADMIN_USERNAME") && Cypress.env("ADMIN_PASSWORD"));
    if (!hasAdminCreds) {
      throw new Error(
        `[SETUP] No sales exist to test DELETE /api/sales/{id}. ` +
          `Either seed sales data in DB OR set CYPRESS_ADMIN_USERNAME and CYPRESS_ADMIN_PASSWORD ` +
          `so the test can create one sale as setup.`
      );
    }

    return loginAs("ADMIN").then((adminToken) =>
      getAnyPlantId(adminToken).then((plantId) =>
        apiRequest({
          method: "POST",
          path: `/api/sales/plant/${plantId}`,
          token: adminToken,
          qs: { quantity: 1 },
          failOnStatusCode: false,
        }).then((sellRes) => {
          if (sellRes.status !== 201) {
            throw new Error(
              `[SETUP] Expected 201 from ADMIN sell plant but got ${sellRes.status}. ` +
                `Body: ${JSON.stringify(sellRes.body)}`
            );
          }
          if (!sellRes.body?.id) {
            throw new Error(
              `[SETUP] Sale creation response missing id: ${JSON.stringify(sellRes.body)}`
            );
          }
          return sellRes.body.id;
        })
      )
    );
  });
}

/* -------------------------
   Steps
-------------------------- */

Given(`I am authenticated to the API as {string}`, (role) => {
  return loginAs(role.toUpperCase());
});

When(`I request all sales`, () => {
  getToken("USER").then((token) => {
    apiRequest({
      method: "GET",
      path: "/api/sales",
      token,
      failOnStatusCode: false,
    }).then((res) => setLastResponse(res));
  });
});

When(`I request paged sales with page {int} and size {int} and sort {string}`, (page, size, sort) => {
  getToken("USER").then((token) => {
    apiRequest({
      method: "GET",
      path: "/api/sales/page",
      token,
      qs: { page, size, sort },
      failOnStatusCode: false,
    }).then((res) => setLastResponse(res));
  });
});

When(`I request all sales without authentication`, () => {
  apiRequest({
    method: "GET",
    path: "/api/sales",
    token: null,
    failOnStatusCode: false,
  }).then((res) => setLastResponse(res));
});

When(`I attempt to sell any available plant with quantity {int} as {string}`, (quantity, role) => {
  const upperRole = role.toUpperCase();

  getToken(upperRole).then((token) => {
    getAnyPlantId(token).then((plantId) => {
      apiRequest({
        method: "POST",
        path: `/api/sales/plant/${plantId}`,
        token,
        qs: { quantity },
        failOnStatusCode: false,
      }).then((res) => setLastResponse(res));
    });
  });
});

When(`I attempt to delete any existing sale as {string}`, (role) => {
  const upperRole = role.toUpperCase();

  getToken(upperRole).then((token) => {
    getAnySaleIdOrSeed(token).then((saleId) => {
      apiRequest({
        method: "DELETE",
        path: `/api/sales/${saleId}`,
        token,
        failOnStatusCode: false,
      }).then((res) => setLastResponse(res));
    });
  });
});

Then(`the response status code should be {int}`, (code) => {
  getLastResponse().then((res) => {
    expect(res.status).to.equal(code);
  });
});

Then(`the response should be a JSON array of Sale objects`, () => {
  getLastResponse().then((res) => {
    expect(res.headers).to.have.property("content-type");
    expect(res.headers["content-type"]).to.include("application/json");

    expect(res.body).to.be.an("array");
    res.body.forEach(assertSaleShape);
  });
});

Then(`the response should match the PageSale schema with max page size {int}`, (maxSize) => {
  getLastResponse().then((res) => {
    expect(res.headers["content-type"]).to.include("application/json");
    assertPageSaleSchema(res.body, maxSize);

    // Optional strong check: ensure soldAt is desc when sort is soldAt,desc
    const dates = res.body.content.map((s) => new Date(s.soldAt).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).to.be.at.most(dates[i - 1]);
    }
  });
});

Then(`the error response should match the ErrorResponse schema`, () => {
  getLastResponse().then((res) => {
    expect(res.body).to.be.an("object");
    assertErrorResponseSchema(res.body);
  });
});

Then(`the response should contain an authorization error message`, () => {
  getLastResponse().then((res) => {

    if (res.body && typeof res.body === "object" && "message" in res.body) {
      expect(String(res.body.message).toLowerCase()).to.include("forbidden");
    } else {
      expect(res.body).to.not.have.property("soldAt");
    }
  });
});
