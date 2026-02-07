Feature: Plant Management (Search, Filter, Sort) API - Admin

    Background:
        Given I have a valid Admin JWT token

    @api @admin @smoke
    Scenario: TC_PLANT_SEARCH_API_ADMIN_01 - Search plants by name
        Given at least 3 plants exist in the system
        When I send GET request to "/api/plants?name=Orchid" with Admin token
        Then the response status code should be 200
        And the response body should be a JSON array
        And all returned plants should have "Orchid" in their name

    @api @admin @smoke
    Scenario: TC_PLANT_SEARCH_API_ADMIN_02 - Filter plants by category
        Given at least 2 categories with plants exist
        When I send GET request to "/api/plants?categoryId=2" with Admin token
        Then the response status code should be 200
        And the response body should be a JSON array
        And all returned plants should belong to categoryId 2

    @api @admin @smoke
    Scenario: TC_PLANT_SEARCH_API_ADMIN_03 - Sort plants by multiple fields
        Given at least 3 plants exist in the system
        When I send GET request to "/api/plants?sortBy=name&sortDirection=desc" with Admin token
        Then the response status code should be 200
        And the response body should be a JSON array
        And plants should be sorted by name in descending order
        When I send GET request to "/api/plants?sortBy=quantity&sortDirection=desc" with Admin token
        Then the response status code should be 200
        And the response body should be a JSON array
        And plants should be sorted by quantity in descending order

    @api @admin @negative
    Scenario: TC_PLANT_SEARCH_API_ADMIN_04 - Handle invalid query parameters
        When I send GET request to "/api/plants?invalidParam=test" with Admin token
        Then the response status code should be 200
        And all plants should be returned as if no filter was applied
        When I send GET request to "/api/plants?sortBy=invalidField" with Admin token
        Then the response status code should be 400 or 200
        And the API should handle invalid sortBy gracefully

    @api @admin @negative
    Scenario: TC_PLANT_SEARCH_API_ADMIN_05 - Search with no results
        When I send GET request to "/api/plants?name=NonExistentPlant999" with Admin token
        Then the response status code should be 200
        And the response body should be an empty JSON array
        And no error message should be returned