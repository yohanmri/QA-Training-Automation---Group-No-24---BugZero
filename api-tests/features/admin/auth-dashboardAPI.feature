Feature: Admin Authentication and Dashboard API Tests

    Background:
        Given the API is available at "http://localhost:8080"

    @TC_AUTH_API_ADMIN_01
    Scenario: TC_AUTH_API_ADMIN_01 - Login successfully with Admin credentials
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "admin",
                "password": "admin123"
            }
            """
        Then the response status code should be 200
        And the response body should contain "token"
        And the response should contain a valid JWT token
        And the response should contain role "ROLE_ADMIN"
        And the token should be saved for subsequent requests

    @TC_AUTH_API_ADMIN_02
    Scenario: TC_AUTH_API_ADMIN_02 - Reject invalid Admin username
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "invalidadmin",
                "password": "admin123"
            }
            """
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_ADMIN_03
    Scenario: TC_AUTH_API_ADMIN_03 - Verify JWT token validity
        Given I am authenticated as admin
        When I send a GET request to "/api/dashboard" with Bearer token
        Then the response status code should be 200
        When I send a GET request to "/api/categories" with Bearer token
        Then the response status code should be 200
        And the response body should contain "id"
        And the response body should contain "name"
    #  I need /api/dashboard endpoint to exist


    @TC_AUTH_API_ADMIN_04
    Scenario: TC_AUTH_API_ADMIN_04 - Access Dashboard statistics with Admin token
        Given I am authenticated as admin
        When I send a GET request to "/api/dashboard" with Bearer token
        Then the response status code should be 200
        And the dashboard response should contain admin statistics
    # I need /api/dashboard endpoint to exist
    # this fail with 500 or 404 error

    @TC_AUTH_API_ADMIN_05
    Scenario: TC_AUTH_API_ADMIN_05 - Logout Admin successfully
        Given I am authenticated as admin
        When I send a POST request to "/api/auth/logout" with Bearer token
        Then the response status code should be 200
        When I send a GET request to "/api/dashboard" with Bearer token
        Then the response status code should be 401
    #  I need : This test expects /api/auth/logout endpoint to exist

    @TC_AUTH_API_ADMIN_06
    Scenario: TC_AUTH_API_ADMIN_06 - Login with correct username but wrong password
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "admin",
                "password": "wrongpassword123"
            }
            """
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_ADMIN_07
    Scenario: TC_AUTH_API_ADMIN_07 - Verify token works across multiple protected endpoints
        Given I am authenticated as admin
        When I send a GET request to "/api/categories" with Bearer token
        Then the response status code should be 200
        When I send a GET request to "/api/plants" with Bearer token
        Then the response status code should be 200
        When I send a GET request to "/api/sales" with Bearer token
        Then the response status code should be 200

    @TC_AUTH_API_ADMIN_08
    Scenario: TC_AUTH_API_ADMIN_08 - Reject access with malformed token
        Given I am authenticated as admin
        When I send a GET request to "/api/categories" with malformed Bearer token
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_ADMIN_09
    Scenario: TC_AUTH_API_ADMIN_09 - Verify case-sensitive username validation
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "ADMIN",
                "password": "admin123"
            }
            """
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_ADMIN_10
    Scenario: TC_AUTH_API_ADMIN_10 - Verify admin can access admin-only endpoints after authentication
        Given I am authenticated as admin
        When I send a POST request to "/api/categories" with Bearer token and body:
            """
            {
                "name": "TestCat",
                "parentCategoryId": null
            }
            """
        Then the response status code should be 201
        And the response body should contain "name"
        And the response body should contain "TestCat"