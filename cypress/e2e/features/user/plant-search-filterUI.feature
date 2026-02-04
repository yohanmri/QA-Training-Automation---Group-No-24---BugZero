Feature: Plant Management (Search, Filter, Sort) UI - User

    Background:
        Given user is logged in as "user"

    @ui @user @smoke
    Scenario: TC_PLANT_SEARCH_UI_USER_01 - Search plants by name
        Given at least 3 plants exist with different names
        When I navigate to the Plants page
        Then the Plants List page should be displayed
        And the search box should be visible
        When I enter "Rose" in the plant search box
        And I click the plant search button
        Then only plants with "Rose" in their name should be displayed
        And plants without "Rose" in their name should not be displayed

    @ui @user @smoke
    Scenario: TC_PLANT_SEARCH_UI_USER_02 - Filter plants by category
        Given at least 2 categories exist with plants assigned to each category
        When I navigate to the Plants page
        Then the category filter dropdown should be displayed
        When I select a specific category from the plant filter dropdown
        And I click the plant search button
        Then only plants belonging to the selected category should be displayed
        And plants from other categories should not be displayed

    @ui @user @smoke
    Scenario: TC_PLANT_SEARCH_UI_USER_03 - Sort plants by Name
        Given at least 3 plants exist with different names
        When I navigate to the Plants page
        Then the plants table should be displayed with plant records
        When I click the "Name" column header on plants page
        Then plants should be sorted by Name in ascending order
        When I click the "Name" column header on plants page
        Then plants should be sorted by Name in descending order

    @ui @user @smoke
    Scenario: TC_PLANT_SEARCH_UI_USER_04 - Sort plants by Price and Quantity
        Given at least 3 plants exist with different Price and Quantity values
        When I navigate to the Plants page
        Then the plants table should be displayed
        When I click the "Price" column header
        Then plants should be sorted by Price in ascending order
        When I click the "Price" column header
        Then plants should be sorted by Price in descending order
        When I click the "Quantity" column header
        Then plants should be sorted by Quantity in ascending order
        When I click the "Quantity" column header
        Then plants should be sorted by Quantity in descending order

    @ui @user @smoke
    Scenario: TC_PLANT_SEARCH_UI_USER_05 - Display "Low" badge for low stock
        Given at least 1 plant with quantity less than 5 exists
        And at least 1 plant with quantity greater than or equal to 5 exists
        When I navigate to the Plants page
        Then the plants table should be displayed
        And a "Low" badge should be displayed for plants with quantity less than 5
        And no "Low" badge should be displayed for plants with quantity greater than or equal to 5