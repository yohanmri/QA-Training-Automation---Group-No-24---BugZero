Feature: Plant Management (Search, Filter, Sort) UI - Admin

    Background:
        Given user is logged in as "admin"

    @ui @admin @smoke
    Scenario: TC_PLANT_SEARCH_UI_ADMIN_01 - Search plants by name
        Given at least 3 plants exist with different names
        When I navigate to the Plants page
        Then the Plants List page should be displayed
        And the search box should be visible
        When I enter "Tulip" in the plant search box
        And I click the plant search button
        Then only plants with "Tulip" in their name should be displayed
        And the "Add Plant" button should be visible for Admin
        And the Edit and Delete actions should be visible for Admin

    @ui @admin @smoke
    Scenario: TC_PLANT_SEARCH_UI_ADMIN_02 - Reset search and filters
        Given at least 5 plants exist
        When I navigate to the Plants page
        And I enter "Rose" in the plant search box
        And I click the plant search button
        Then filtered plant results should be displayed
        When I click the Reset button on plants page
        Then the plant search box should be cleared
        And all plants should be displayed without filters

    @ui @admin @smoke
    Scenario: TC_PLANT_SEARCH_UI_ADMIN_03 - Filter by category and sort by price
        Given at least 2 categories exist with multiple plants in each category
        When I navigate to the Plants page
        And I select a category from the plant filter dropdown
        And I click the plant search button
        Then only plants from selected category should be displayed
        When I click the "Price" column header
        Then plants should be sorted by price while maintaining category filter

    @ui @admin @smoke
    Scenario: TC_PLANT_SEARCH_UI_ADMIN_04 - Pagination with search applied
        Given at least 15 plants exist with "Rose" in their names
        When I navigate to the Plants page
        And I enter "Rose" in the plant search box
        And I click the plant search button
        Then filtered plant results should be displayed
        And pagination controls should be visible
        When I click the Next page control on plants page
        Then the next page of filtered results should be displayed
        And all results should still contain "Rose" in their name

    @ui @admin @validation
    Scenario: TC_PLANT_SEARCH_UI_ADMIN_05 - Display "No plants found" when search returns empty
        Given at least 1 plant exists
        When I navigate to the Plants page
        And I enter "XYZPlant123" in the plant search box
        And I click the plant search button
        Then "No plants found" message should be displayed
        And the plants table should be empty