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
        And the response should contain role "ROLE_USER"
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
        Then the response status code should be 400
        And the response should contain validation errors

    @TC_AUTH_API_USER_04
    Scenario: TC_AUTH_API_USER_04 - Access Dashboard statistics with User token
        When I send a POST request to "/api/auth/login" with body:
            """
            {
                "username": "testuser",
                "password": "test123"
            }
            """
        Then the response status code should be 200
        And the token should be saved for subsequent requests
        When I send a GET request to "/api/dashboard" with Bearer token
        Then the response status code should be 200
        And the dashboard response should contain user statistics structure

    @TC_AUTH_API_USER_05
    Scenario: TC_AUTH_API_USER_05 - Reject unauthorized access without token
        When I send a GET request to "/api/dashboard"
        Then the response status code should be 401
        And the response body should contain "Unauthorized"
