Feature: Sales List - User Role

  Background:
    Given user is logged in as "user"

  Scenario: Verify that a User can view the Sales List page with a paginated list of sales records
    Given sales records exist more than 10 for pagination
    And user navigates to the "Sales" page
    Then validate Sales List page header is displayed
    And validate Sales table has at least 1 record
    And validate pagination component is displayed
    When user clicks next page in pagination
    Then validate user is on page "1"
    And validate Sales table has at least 1 record

  Scenario: Verify that the Sales List page is sorted by Sold Date in descending order by default
    Given user navigates to the "Sales" page
    Then validate Sales table has at least 1 record
    And validate Sales table is sorted by Sold At in "desc" order
    When user clicks sort by "Sold At"
    Then validate Sales table is sorted by Sold At in "asc" order

  Scenario: Verify that a User can sort Sales List records by Plant Name, Quantity, Total Price and Sold Date
    Given user navigates to the "Sales" page
    Then validate Sales table has at least 1 record

    When user clicks sort by "Plant"
    Then validate Sales table is sorted by column "Plant" based on current URL

    When user clicks sort by "Quantity"
    Then validate Sales table is sorted by column "Quantity" based on current URL

    When user clicks sort by "Total Price"
    Then validate Sales table is sorted by column "Total Price" based on current URL

    When user clicks sort by "Sold At"
    Then validate Sales table is sorted by column "Sold At" based on current URL

  Scenario: Verify that Admin Specific UI controls are inaccessible to User role
    Given user navigates to the "Sales" page
    Then validate "Sell Plant" button is not visible
    And validate delete action is not visible in Sales list

  Scenario: Verify that a User cannot access the Sell Plant page via direct URL and is redirected to a 403 page
    When user navigates directly to "/ui/sales/new"
    Then validate user is redirected to "/ui/403"

  Scenario: TC_SALES_UI_USER_09 - Verify that a User sees “No sales found” message when no sales records exist on Sales List page
    Given sales records are cleared using Admin API
    And user navigates to the "Sales" page
    Then validate "No sales found" message is displayed
    And validate Sales table has 0 rows
    And validate pagination is hidden or disabled

  Scenario: TC_SALES_UI_USER_11 - Verify that Sales List sorting by Total Price sorts values numerically (not lexicographically) for User role
    Given user navigates to the "Sales" page
    Then validate Sales table has at least 1 record
    When user clicks sort by "Total Price"
    Then validate Sales table is sorted by Total Price in "asc" order
    When user clicks sort by "Total Price"
    Then validate Sales table is sorted by Total Price in "desc" order

  Scenario: TC_SALES_UI_USER_12 - Verify that Sales List sorting by Quantity sorts values numerically for User role
    Given user navigates to the "Sales" page
    Then validate Sales table has at least 1 record
    When user clicks sort by "Quantity"
    Then validate Sales table is sorted by Quantity in "asc" order
    When user clicks sort by "Quantity"
    Then validate Sales table is sorted by Quantity in "desc" order
