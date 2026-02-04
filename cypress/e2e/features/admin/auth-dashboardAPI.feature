Feature: Authentication and Dashboard API - Admin

    @api @admin @smoke
    Scenario: TC_AUTH_API_ADMIN_01 - Login successfully with Admin credentials
        When I send POST request to "/api/auth/login" with body:
            | username | admin    |
            | password | admin123 |
        Then the response status code should be 200
        And the response body should contain field "token"
        And the token should be a valid JWT format
        And the response body should contain field "username" with value "admin"
        And the response body should contain field "role" with value "ROLE_ADMIN"

    @api @admin @negative
    Scenario: TC_AUTH_API_ADMIN_02 - Reject invalid Admin username
        When I send POST request to "/api/auth/login" with body:
            | username | invalidadmin |
            | password | admin123     |
        Then the response status code should be 401
        And the response body should contain field "status" with value "401"
        And the response body should contain field "error" with value "UNAUTHORIZED"
        And the response body should contain error message "Invalid username or password"

    @api @admin @smoke
    Scenario: TC_AUTH_API_ADMIN_03 - Verify JWT token validity
        Given I have a valid Admin JWT token
        When I send GET request to "/api/dashboard" with Admin token
        Then the response status code should be 200
        When I send GET request to "/api/categories" with Admin token
        Then the response status code should be 200

    @api @admin @smoke
    Scenario: TC_AUTH_API_ADMIN_04 - Access Dashboard statistics with Admin token
        Given I have a valid Admin JWT token
        And the system has data for categories, plants, and sales
        When I send GET request to "/api/dashboard" with Admin token
        Then the response status code should be 200
        And the response body should contain field "totalCategories"
        And the response body should contain field "mainCategories"
        And the response body should contain field "subCategories"
        And the response body should contain field "totalPlants"
        And the response body should contain field "lowStockPlants"
        And the response body should contain field "totalSales"
        And the response body should contain field "totalRevenue"

    @api @admin @smoke
    Scenario: TC_AUTH_API_ADMIN_05 - Logout Admin successfully
        Given I have a valid Admin JWT token
        When I send POST request to "/api/auth/logout" with Admin token
        Then the response status code should be 200 or 204
        When I send GET request to "/api/dashboard" with the same token
        Then the response status code should be 401