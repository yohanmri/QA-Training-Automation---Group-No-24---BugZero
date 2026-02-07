Feature: Plant Management (Search, Filter, Sort) API - User

    Background:
        Given I have a valid User JWT token

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_01 - Search plants by name
        Given at least 3 plants exist with different names
        When I send GET request to "/api/plants?name=Rose" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        And all returned plants should have "Rose" in their name
        And plants without "Rose" should not be included

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_02 - Filter plants by category
        Given at least 2 categories exist with plants assigned
        When I send GET request to "/api/plants?categoryId=1" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        And all returned plants should belong to categoryId 1
        And plants from other categories should not be included

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_03 - Sort plants by name, price, and quantity
        Given at least 3 plants exist with different values
        When I send GET request to "/api/plants?sortBy=name&sortDirection=asc" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        And plants should be sorted by name in ascending order
        When I send GET request to "/api/plants?sortBy=price&sortDirection=desc" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        And plants should be sorted by price in descending order
        When I send GET request to "/api/plants?sortBy=quantity&sortDirection=asc" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        And plants should be sorted by quantity in ascending order

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_04 - Retrieve plants with pagination
        Given at least 15 plants exist in the system
        When I send GET request to "/api/plants?page=0&size=10" with User token
        Then the response status code should be 200
        And the response should contain pagination metadata
        And the content array should contain at most 10 plant records
        When I send GET request to "/api/plants?page=1&size=10" with User token
        Then the response status code should be 200
        And the second page of results should be returned

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_05 - Combined search, filter, and sort
        Given plants exist with various names, categories, and prices
        When I send GET request to "/api/plants?name=Rose&categoryId=1&sortBy=price&sortDirection=asc" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        And all returned plants should contain "Rose" in their name
        And all returned plants should belong to categoryId 1
        And plants should be sorted by price in ascending order
