Feature: Sales List - User Role

    Background:
        Given the application is running at "http://localhost:8080"
        And I am logged in as user via UI

    @TC_SALES_UI_USER_01
    Scenario: TC_SALES_UI_USER_01 - User can view Sales List with pagination
        When I navigate to "/ui/sales"
        Then the Sales List page header should be displayed
        And the sales table should have at least 1 record
        And the pagination component should be displayed

    @TC_SALES_UI_USER_02
    Scenario: TC_SALES_UI_USER_02 - Sales List sorted by Sold Date descending by default
        When I navigate to "/ui/sales"
        Then the sales table should have at least 1 record
        And the sales table should be sorted by "Sold At" in "desc" order

    @TC_SALES_UI_USER_03
    Scenario: TC_SALES_UI_USER_03 - User can sort Sales List by different columns
        When I navigate to "/ui/sales"
        Then the sales table should have at least 1 record
        When I click sort by "Plant"
        Then the URL should contain sort parameter for "Plant"
        When I click sort by "Quantity"
        Then the URL should contain sort parameter for "Quantity"
        When I click sort by "Total Price"
        Then the URL should contain sort parameter for "Total Price"
        When I click sort by "Sold At"
        Then the URL should contain sort parameter for "Sold At"

    @TC_SALES_UI_USER_04
    Scenario: TC_SALES_UI_USER_04 - Admin controls are not visible to User
        When I navigate to "/ui/sales"
        Then the "Sell Plant" button should not be visible
        And the delete action should not be visible in sales list

    @TC_SALES_UI_USER_05
    Scenario: TC_SALES_UI_USER_05 - User cannot access Sell Plant page via direct URL
        When I navigate to "/ui/sales/new"
        Then I should be redirected to "/ui/403"

    @TC_SALES_UI_USER_09
    Scenario: TC_SALES_UI_USER_09 - User sees "No sales found" when no records exist
        # Note: This test requires clearing sales data first
        When I navigate to "/ui/sales"
        Then I should see message "No sales found" or empty table

    @TC_SALES_UI_USER_11
    Scenario: TC_SALES_UI_USER_11 - Total Price sorting is numerical not lexicographical
        When I navigate to "/ui/sales"
        Then the sales table should have at least 1 record
        When I click sort by "Total Price"
        Then the sales table should be sorted by "Total Price" in "asc" order
        When I click sort by "Total Price"
        Then the sales table should be sorted by "Total Price" in "desc" order

    @TC_SALES_UI_USER_12
    Scenario: TC_SALES_UI_USER_12 - Quantity sorting is numerical
        When I navigate to "/ui/sales"
        Then the sales table should have at least 1 record
        When I click sort by "Quantity"
        Then the sales table should be sorted by "Quantity" in "asc" order
        When I click sort by "Quantity"
        Then the sales table should be sorted by "Quantity" in "desc" order
