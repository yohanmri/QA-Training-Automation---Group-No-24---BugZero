Feature: Plant Management API - User Role

  Background:
    Given I am authenticated as a "user" via API

  Scenario: Retrieve plants list and single plant details
    When I send a GET request to "/api/plants"
    Then the response status code should be 200
    And the response should be a JSON array of plant objects
    When I request a single plant by ID
    Then the response status code should be 200

  Scenario: Unauthorized actions for user role
    Then the following requests should return a 403 Forbidden error:
      | Method | Endpoint                    |
      | POST   | /api/plants/category/2      |
      | PUT    | /api/plants/3               |
      | DELETE | /api/plants/3               |