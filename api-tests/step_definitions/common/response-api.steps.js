const { Then } = require("@badeball/cypress-cucumber-preprocessor");
const { assertErrorResponseSchema } = require("../../support/schema-assertions");

function getLastResponse() {
  return cy.get("@lastResponse");
}

Then(`the response status code should be {int}`, (code) => {
  return getLastResponse().then((res) => {
    expect(res.status).to.equal(code);
  });
});

Then(`the error response should match the ErrorResponse schema`, () => {
  return getLastResponse().then((res) => {
    expect(res.body).to.be.an("object");
    assertErrorResponseSchema(res.body);
  });
});

Then(`the error message should contain {string}`, (text) => {
  return getLastResponse().then((res) => {
    expect(res.body, "Expected response body").to.be.an("object");
    expect(res.body).to.have.property("message");
    expect(String(res.body.message)).to.include(text);
  });
});
