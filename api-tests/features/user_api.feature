Feature: Plant Management API - User Role

  Background:
    Given I am authenticated as a "user" via API

  Scenario: Retrieve all plants (TC_PLANT_API_USER_01)
    When I send a GET request to "/api/plants"
    Then the response status code should be 200
    And the response should be a JSON array of plant objects
    And the first plant in response should contain fields "id", "name", "category", "price", and "quantity"

  Scenario: Retrieve single plant by ID (TC_PLANT_API_USER_02)
    When I send a GET request to "/api/plants"
    And I request a single plant by ID from the list
    Then the response status code should be 200
    And the response body should contain fields "id", "name", "category", "price", and "quantity"

  Scenario: Reject create plant for User role (TC_PLANT_API_USER_03)
    When I send a POST request to "/api/plants" as an unauthorized user
    Then the response should return a 403 Forbidden error

  Scenario: Reject update plant for User role (TC_PLANT_API_USER_04)
    When I send a PUT request to "/api/plants/3" as an unauthorized user
    Then the response should return a 403 Forbidden error

  Scenario: Reject delete plant for User role (TC_PLANT_API_USER_05)
    When I send a DELETE request to "/api/plants/3" as an unauthorized user
    Then the response should return a 403 Forbidden error