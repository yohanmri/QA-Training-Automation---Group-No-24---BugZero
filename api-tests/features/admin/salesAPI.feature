Feature: Admin Sales API Tests

    Background:
        Given the API is available at "http://localhost:8080"

    @TC_SALES_API_ADMIN_01
    Scenario: TC_SALES_API_ADMIN_01 - Admin can sell a plant successfully (POST /api/sales/plant/{plantId})
        Given I am authenticated as admin
        When I sell an existing plant with quantity 1
        Then the response status code should be 201
        And the response should be a Sale object with quantity 1

    @TC_SALES_API_ADMIN_02
    Scenario: TC_SALES_API_ADMIN_02 - Successful sale reduces plant inventory quantity
        Given I am authenticated as admin
        When I sell a plant with stock at least 2 with quantity 1
        Then the response status code should be 201
        And the plant stock should be reduced by 1

    @TC_SALES_API_ADMIN_03
    Scenario: TC_SALES_API_ADMIN_03 - Selling with quantity=0 is rejected (400 Bad Request)
        Given I am authenticated as admin
        When I sell an existing plant with quantity 0
        Then the response status code should be 400
        And the response body should contain "error"

    @TC_SALES_API_ADMIN_04
    Scenario: TC_SALES_API_ADMIN_04 - Selling a non-existent plant returns 404 Not Found
        Given I am authenticated as admin
        When I sell a non-existent plant with quantity 1
        Then the response status code should be 404
        And the response body should contain "error"

    @TC_SALES_API_ADMIN_05
    Scenario: TC_SALES_API_ADMIN_05 - Admin can delete an existing sale and it is no longer retrievable
        Given I am authenticated as admin
        When I delete an existing sale
        Then the response status code should be 204
        And the deleted sale should not be retrievable
