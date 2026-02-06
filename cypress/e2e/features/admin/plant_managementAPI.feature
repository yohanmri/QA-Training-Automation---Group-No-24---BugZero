Feature: Plant Management API - Admin Role

  Background:
    Given I am authenticated as an "admin" via API

  Scenario: Create plant using POST with valid Admin token (TC_PLANT_API_ADMIN_01)
    When I send a POST request to create a plant under category 2
    Then the response status code should be 201

  Scenario: Validate POST response status code (TC_PLANT_API_ADMIN_02)
    When I send a POST request to create a plant under category 2
    Then the response status code should be 201

  Scenario: Validate response body fields for created plant (TC_PLANT_API_ADMIN_03)
    When I send a POST request to create a plant under category 2
    Then the response body should contain fields "id", "name", "category", "price", and "quantity"

  Scenario: Validate created plant data accuracy (TC_PLANT_API_ADMIN_04)
    # Following the steps in your spreadsheet: Sending with User token to expect 403
    Given I am authenticated as a "user" via API
    When I send a POST request to "/api/plants/category/2" as an unauthorized user
    Then the response should return a 403 Forbidden error

  Scenario: Validate response content type (TC_PLANT_API_ADMIN_05)
    When I send a POST request to create a plant under category 2
    Then the response Content-Type should be "application/json"
