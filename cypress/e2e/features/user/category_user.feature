Feature: Category Management API - User Role

  Background:
    Given I am authenticated as a "user" via API

  Scenario: Retrieve all categories (TC_CATEGORY_API_USER_01)
    When I send a GET request to "/api/categories"
    Then the response status code should be 200
    And the response should be a JSON array of Category objects

  Scenario: Retrieve single category by ID (TC_CATEGORY_API_USER_02)
    When I send a GET request to "/api/categories"
    And I request a single category by ID from the list
    Then the response status code should be 200
    And the response body should contain "id", "name", and "parentName"

  Scenario: Reject create category for User role (TC_CATEGORY_API_USER_03)
    When I send a POST category request as an unauthorized user
    Then the response should return a 403 Forbidden error

  Scenario: Reject update category for User role (TC_CATEGORY_API_USER_04)
    When I send a PUT category request for ID 1 as an unauthorized user
    Then the response should return a 403 Forbidden error

  Scenario: Reject delete category for User role (TC_CATEGORY_API_USER_05)
    When I send a DELETE category request for ID 1 as an unauthorized user
    Then the response should return a 403 Forbidden error