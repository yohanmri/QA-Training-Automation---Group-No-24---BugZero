// api-tests/step_definitions/common/auth-api.steps.js
const { Given } = require("@badeball/cypress-cucumber-preprocessor");
const { apiLogin, getCredentialsFor } = require("../../support/api-client");

function loginAs(role) {
  const creds = getCredentialsFor(role);

  return apiLogin(creds).then((token) => {
    return cy
      .wrap(token, { log: false })
      .as(`${role.toLowerCase()}Token`)
      .then(() => token);
  });
}

Given(`I am authenticated to the API as {string}`, (role) => {
  return loginAs(role.toUpperCase());
});
