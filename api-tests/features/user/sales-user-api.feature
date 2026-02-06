@api @sales @user
Feature: Sales API - User role access and validations

  # TC_SALES_API_USER_01
  Scenario: User can retrieve all sales (GET /api/sales)
    Given I am authenticated to the API as "USER"
    When I request all sales
    Then the response status code should be 200
    And the response should be a JSON array of Sale objects

  # TC_SALES_API_USER_02
  Scenario: User can retrieve paged sales with sorting (GET /api/sales/page)
    Given I am authenticated to the API as "USER"
    When I request paged sales with page 0 and size 5 and sort "soldAt,desc"
    Then the response status code should be 200
    And the response should match the PageSale schema with max page size 5

  # TC_SALES_API_USER_03
  Scenario: Retrieving sales without a Bearer token is rejected
    When I request all sales without authentication
    Then the response status code should be 401
    And the error response should match the ErrorResponse schema

  # TC_SALES_API_USER_04
  Scenario: User role cannot sell a plant (POST /api/sales/plant/{plantId})
    Given I am authenticated to the API as "USER"
    When I attempt to sell any available plant with quantity 1 as "USER"
    Then the response status code should be 403
    And the response should contain an authorization error message

  # TC_SALES_API_USER_05
  Scenario: User role cannot delete a sale (DELETE /api/sales/{id})
    Given I am authenticated to the API as "USER"
    When I attempt to delete any existing sale as "USER"
    Then the response status code should be 403
    And the response should contain an authorization error message

    # TC_SALES_API_USER_09
  Scenario: Retrieve a non-existent sale by id returns 404 Not Found (GET /api/sales/{id})
    Given I am authenticated to the API as "USER"
    When I request a sale by a non-existent id
    Then the response status code should be 404
    And the error response should match the ErrorResponse schema
    And the error message should contain "Sale not found"

  # TC_SALES_API_USER_12
  Scenario: Each Sale has correct totalPrice (plant.price × quantity) (GET /api/sales)
    Given I am authenticated to the API as "USER"
    When I request all sales
    Then the response status code should be 200
    And each Sale in the response should have correct totalPrice

