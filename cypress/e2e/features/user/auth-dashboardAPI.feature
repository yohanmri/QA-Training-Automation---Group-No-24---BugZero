Feature: Authentication and Dashboard API - User

    @api @user @smoke
    Scenario: TC_AUTH_API_USER_01 - Login successfully with User credentials
        When I send POST request to "/api/auth/login" with body:
            | username | user    |
            | password | user123 |
        Then the response status code should be 200
        And the response body should contain field "token"
        And the token should be a valid JWT format
        And the response body should contain field "username" with value "user"
        And the response body should contain field "role" with value "ROLE_USER"

    @api @user @negative
    Scenario: TC_AUTH_API_USER_02 - Reject invalid User credentials
        When I send POST request to "/api/auth/login" with body:
            | username | user          |
            | password | wrongpassword |
        Then the response status code should be 401
        And the response body should contain field "status" with value "401"
        And the response body should contain field "error" with value "UNAUTHORIZED"
        And the response body should contain error message "Invalid username or password"

    @api @user @negative
    Scenario: TC_AUTH_API_USER_03 - Reject empty credentials
        When I send POST request to "/api/auth/login" with body:
            | username |  |
            | password |  |
        Then the response status code should be 400
        And the response body should contain validation errors for username and password

    @api @user @smoke
    Scenario: TC_AUTH_API_USER_04 - Access Dashboard statistics with User token
        Given I have a valid User JWT token
        When I send GET request to "/api/dashboard" with User token
        Then the response status code should be 200
        And the response body should contain field "totalCategories"
        And the response body should contain field "mainCategories"
        And the response body should contain field "subCategories"
        And the response body should contain field "totalPlants"
        And the response body should contain field "lowStockPlants"
        And the response body should contain field "totalSales"
        And the response body should contain field "totalRevenue"

    @api @user @negative
    Scenario: TC_AUTH_API_USER_05 - Reject unauthorized access without token
        When I send GET request to "/api/dashboard" without authentication
        Then the response status code should be 401
        And the response body should contain field "status" with value "401"
        And the response body should contain field "error" with value "UNAUTHORIZED"
        And the response body should contain error message "Unauthorized - Use Basic Auth or JWT"