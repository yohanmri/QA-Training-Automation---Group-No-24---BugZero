Feature: Sales - Unauthenticated User

  Background:
    Given user is not logged in

  Scenario: TC_SALES_UI_USER_10 - Verify that a User is redirected to the Login page when accessing Sales List page without authentication
    When unauthenticated user navigates directly to "/ui/sales"
    Then validate unauthenticated user is redirected to "/ui/login"
    And validate login page endpoint is accessible
