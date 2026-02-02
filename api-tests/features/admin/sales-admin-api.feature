Feature: Sales API - Admin role (Sell + Delete)

  Background:
    Given I am authenticated to the API as "ADMIN"

  # TC_SALES_API_ADMIN_01
  Scenario: Admin can sell a plant successfully (POST /api/sales/plant/{plantId})
    When I sell an existing plant as "ADMIN" with quantity 1
    Then the response status code should be 201
    And the response should be a Sale object with quantity 1

  # TC_SALES_API_ADMIN_02
  Scenario: Successful sale reduces plant inventory quantity
    When I sell a plant with stock at least 2 as "ADMIN" with quantity 1
    Then the response status code should be 201
    And the plant stock should be reduced by 1

  # TC_SALES_API_ADMIN_03
  Scenario: Selling with quantity=0 is rejected (400 Bad Request)
    When I sell an existing plant as "ADMIN" with quantity 0
    Then the response status code should be 400
    And the error response should match the ErrorResponse schema

  # TC_SALES_API_ADMIN_04
  Scenario: Selling a non-existent plant returns 404 Not Found
    When I sell a non-existent plant as "ADMIN" with quantity 1
    Then the response status code should be 404
    And the error response should match the ErrorResponse schema

  # TC_SALES_API_ADMIN_05
  Scenario: Admin can delete an existing sale and it is no longer retrievable
    When I delete an existing sale as "ADMIN"
    Then the response status code should be 204
    And the deleted sale should not be retrievable
