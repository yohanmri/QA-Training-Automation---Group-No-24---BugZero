Feature: Sales API - Admin Role

    Background:
        Given the API is available at "http://localhost:8080"
        And I am authenticated as admin

    @TC_SALES_API_ADMIN_01
    Scenario: TC_SALES_API_ADMIN_01 - Admin can sell a plant successfully
        When I sell an existing plant with quantity 1
        Then the response status code should be 201
        And the response should be a Sale object with quantity 1

    @TC_SALES_API_ADMIN_02
    Scenario: TC_SALES_API_ADMIN_02 - Successful sale reduces plant inventory quantity
        When I sell a plant with stock at least 2 with quantity 1
        Then the response status code should be 201
        And the plant stock should be reduced by 1

    @TC_SALES_API_ADMIN_03
    Scenario: TC_SALES_API_ADMIN_03 - Selling with quantity=0 is rejected (400 Bad Request)
        When I sell an existing plant with quantity 0
        Then the response status code should be 400
        And the error response should match the ErrorResponse schema

    @TC_SALES_API_ADMIN_04
    Scenario: TC_SALES_API_ADMIN_04 - Selling a non-existent plant returns 404 Not Found
        When I sell a non-existent plant with quantity 1
        Then the response status code should be 404
        And the error response should match the ErrorResponse schema

    @TC_SALES_API_ADMIN_05
    Scenario: TC_SALES_API_ADMIN_05 - Admin can delete an existing sale
        When I delete an existing sale
        Then the response status code should be 204
        And the deleted sale should not be retrievable

    @TC_SALES_API_ADMIN_09
    Scenario: TC_SALES_API_ADMIN_09 - Selling without Bearer token is rejected (401 Unauthorized)
        When I attempt to sell an existing plant without authentication with quantity 1
        Then the response status code should be 401
        And the error response should match the ErrorResponse schema

    @TC_SALES_API_ADMIN_10
    Scenario: TC_SALES_API_ADMIN_10 - Deleting without Bearer token is rejected (401 Unauthorized)
        When I attempt to delete an existing sale without authentication
        Then the response status code should be 401
        And the error response should match the ErrorResponse schema

    @TC_SALES_API_ADMIN_11
    Scenario: TC_SALES_API_ADMIN_11 - Selling quantity equal to current stock sets plant quantity to 0
        When I sell a plant with its full stock
        Then the response status code should be 201
        And the plant quantity should be 0 after selling all stock
