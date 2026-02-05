Feature: Plant Management API - Admin Role

  Background:
    Given I am authenticated as an "admin" via API

  Scenario: Successfully create a new plant
    When I send a POST request to create a plant under category 2
    Then the response status code should be 201
    And the response body should contain fields "id", "name", "category", "price", and "quantity"
    And the response data should match the request payload
    