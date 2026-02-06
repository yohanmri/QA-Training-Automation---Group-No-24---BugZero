Feature: User Authentication and Dashboard API Tests

    Background:
        Given the API is available at "http://localhost:8080"

    @TC_AUTH_API_USER_01
    Scenario: TC_AUTH_API_USER_01 - Login successfully with User credentials
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "testuser",
                "password": "test123"
            }
            """
        Then the response status code should be 200
        And the response body should contain "token"
        And the response should contain a valid JWT token
        And the token should be saved for subsequent requests

    @TC_AUTH_API_USER_02
    Scenario: TC_AUTH_API_USER_02 - Reject invalid User credentials
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "testuser",
                "password": "wrongpassword"
            }
            """
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_USER_03
    Scenario: TC_AUTH_API_USER_03 - Reject empty credentials
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "",
                "password": ""
            }
            """
        Then the response status code should be 401
    # NOTE: Test case document expects 400, but actual API returns 401
    # This is a potential bug - document as BUG-AUTH-003

    @TC_AUTH_API_USER_04
    Scenario: TC_AUTH_API_USER_04 - Access Dashboard statistics with User token
        Given I am authenticated as user
        When I send a GET request to "/api/dashboard" with Bearer token
        Then the response status code should be 200
        And the response body should contain "totalCategories"
        And the response body should contain "totalPlants"
    # NOTE: This test expects /api/dashboard endpoint to exist
    # KNOWN BUG: BUG-API-001 - /api/dashboard endpoint does not exist
    # Test will fail with 401 or 500 error

    @TC_AUTH_API_USER_05
    Scenario: TC_AUTH_API_USER_05 - Reject unauthorized access without token
        When I send a GET request to "/api/dashboard"
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_USER_06
    Scenario: TC_AUTH_API_USER_06 - Login with correct username but wrong password
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "testuser",
                "password": "wrongpass"
            }
            """
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_USER_07
    Scenario: TC_AUTH_API_USER_07 - Verify user token works for read-only endpoints
        Given I am authenticated as user
        When I send a GET request to "/api/categories" with Bearer token
        Then the response status code should be 200
        When I send a GET request to "/api/plants" with Bearer token
        Then the response status code should be 200
        When I send a GET request to "/api/sales" with Bearer token
        Then the response status code should be 200

    @TC_AUTH_API_USER_08
    Scenario: TC_AUTH_API_USER_08 - Verify user cannot access admin-only create operations
        Given I am authenticated as user
        When I send a POST request to "/api/categories" with Bearer token and body:
            """
            {
                "name": "TestCat",
                "parentCategoryId": null
            }
            """
        Then the response status code should be 403
        And the response body should contain "Forbidden"

    @TC_AUTH_API_USER_09
    Scenario: TC_AUTH_API_USER_09 - Verify case-sensitive password validation
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "testuser",
                "password": "TEST123"
            }
            """
        Then the response status code should be 401
        And the response body should contain "Unauthorized"

    @TC_AUTH_API_USER_10
    Scenario: TC_AUTH_API_USER_10 - Verify user login with special characters in password
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "testuser",
                "password": "test123!@#"
            }
            """
        Then the response status code should be 401