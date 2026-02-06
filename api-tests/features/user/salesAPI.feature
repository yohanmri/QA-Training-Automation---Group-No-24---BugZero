Feature: User Sales API Tests

    Background:
        Given the API is available at "http://localhost:8080"

    @TC_SALES_API_USER_01
    Scenario: TC_SALES_API_USER_01 - User can retrieve all sales (GET /api/sales)
        Given I am authenticated as user
        When I send a GET request to "/api/sales" with Bearer token
        Then the response status code should be 200
        And the response should be a JSON array of Sale objects

    @TC_SALES_API_USER_02
    Scenario: TC_SALES_API_USER_02 - User can retrieve paged sales with sorting (GET /api/sales/page)
        Given I am authenticated as user
        When I request paged sales with page 0 and size 5 and sort "soldAt,desc"
        Then the response status code should be 200
        And the response should match the PageSale schema with max page size 5

    @TC_SALES_API_USER_03
    Scenario: TC_SALES_API_USER_03 - Retrieving sales without a Bearer token is rejected
        When I send a GET request to "/api/sales"
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_SALES_API_USER_04
    Scenario: TC_SALES_API_USER_04 - User role cannot sell a plant (POST /api/sales/plant/{plantId})
        Given I am authenticated as user
        When I attempt to sell any available plant with quantity 1
        Then the response status code should be 403
        And the response should contain an authorization error message

    @TC_SALES_API_USER_05
    Scenario: TC_SALES_API_USER_05 - User role cannot delete a sale (DELETE /api/sales/{id})
        Given I am authenticated as user
        When I attempt to delete any existing sale
        Then the response status code should be 403
        And the response should contain an authorization error message
