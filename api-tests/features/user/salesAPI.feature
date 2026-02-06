Feature: Sales API - User Role

    Background:
        Given the API is available at "http://localhost:8080"
        And I am authenticated as user

    @TC_SALES_API_USER_01
    Scenario: TC_SALES_API_USER_01 - User can retrieve all sales
        When I request all sales
        Then the response status code should be 200
        And the response should be a JSON array of Sale objects

    @TC_SALES_API_USER_02
    Scenario: TC_SALES_API_USER_02 - User can retrieve paged sales with sorting
        When I request paged sales with page 0 and size 5 and sort "soldAt,desc"
        Then the response status code should be 200
        And the response should match the PageSale schema with max page size 5

    @TC_SALES_API_USER_03
    Scenario: TC_SALES_API_USER_03 - Retrieving sales without Bearer token is rejected
        When I request all sales without authentication
        Then the response status code should be 401
        And the error response should match the ErrorResponse schema

    @TC_SALES_API_USER_04
    Scenario: TC_SALES_API_USER_04 - User role cannot sell a plant (403 Forbidden)
        When I attempt to sell any available plant with quantity 1
        Then the response status code should be 403
        And the response should contain an authorization error message

    @TC_SALES_API_USER_05
    Scenario: TC_SALES_API_USER_05 - User role cannot delete a sale (403 Forbidden)
        When I attempt to delete any existing sale
        Then the response status code should be 403
        And the response should contain an authorization error message

    @TC_SALES_API_USER_09
    Scenario: TC_SALES_API_USER_09 - Retrieve non-existent sale returns 404 Not Found
        When I request a sale by a non-existent id
        Then the response status code should be 404
        And the error response should match the ErrorResponse schema

    @TC_SALES_API_USER_12
    Scenario: TC_SALES_API_USER_12 - Each Sale has correct totalPrice calculation
        When I request all sales
        Then the response status code should be 200
        And each Sale in the response should have correct totalPrice
