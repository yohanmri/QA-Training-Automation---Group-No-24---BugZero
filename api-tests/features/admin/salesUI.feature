Feature: Sales - Admin Role

    Background:
        Given the application is running at "http://localhost:8080"
        And I am logged in as admin via UI

    @TC_SALES_UI_ADMIN_01
    Scenario: TC_SALES_UI_ADMIN_01 - Verify "Sell Plant" button is visible for Admin
        When I navigate to "/ui/sales"
        Then the "Sell Plant" button should be visible
        And the sales actions column should be visible

    @TC_SALES_UI_ADMIN_02
    Scenario: TC_SALES_UI_ADMIN_02 - Admin can create sale and inventory reduces
        When I navigate to "/ui/sales"
        And I click on "Sell Plant" button
        Then I should be on "/ui/sales/new"
        And the Sell Plant form should be displayed
        When I select the first plant with stock at least 1
        And I enter quantity "1" in sales form
        And I click the "Sell" button in sales form
        Then I should be redirected to "/ui/sales"
        And the newly created sale should be visible in the table
        When I navigate to "/ui/plants"
        Then the selected plant stock should be reduced by 1

    @TC_SALES_UI_ADMIN_03
    Scenario: TC_SALES_UI_ADMIN_03 - Sell Plant form validation works
        When I navigate to "/ui/sales/new"
        Then the Sell Plant form should be displayed
        When I leave plant unselected
        And I enter quantity "1" in sales form
        And I click the "Sell" button in sales form
        Then I should see validation message "Plant is required"
        When I select the first plant with stock at least 1
        And I enter quantity "0" in sales form
        Then the quantity input should be invalid
        When I enter quantity "1" in sales form
        And I click the "Sell" button in sales form
        Then I should be redirected to "/ui/sales"

    @TC_SALES_UI_ADMIN_04
    Scenario: TC_SALES_UI_ADMIN_04 - Cancel action navigates back without creating sale
        When I navigate to "/ui/sales"
        And I capture the current sales row count
        And I click on "Sell Plant" button
        Then the Sell Plant form should be displayed
        When I select the first plant with stock at least 1
        And I enter quantity "1" in sales form
        And I click the "Cancel" button in sales form
        Then I should be redirected to "/ui/sales"
        And the sales row count should be unchanged

    @TC_SALES_UI_ADMIN_05
    Scenario: TC_SALES_UI_ADMIN_05 - Admin can delete sale after confirming
        When I navigate to "/ui/sales"
        Then the sales table should have at least 1 record
        When I delete the first sale after confirming
        Then I should see success message "Sale deleted successfully"
        And the deleted sale should not be in the table

    @TC_SALES_UI_ADMIN_09
    Scenario: TC_SALES_UI_ADMIN_09 - Plant dropdown shows only available plants with stock
        When I navigate to "/ui/sales/new"
        Then the Sell Plant form should be displayed
        And the plant dropdown should list only plants with stock greater than 0
        And each plant option should show stock value

    @TC_SALES_UI_ADMIN_11
    Scenario: TC_SALES_UI_ADMIN_11 - Cancelling delete confirmation does not delete sale
        When I navigate to "/ui/sales"
        Then the sales table should have at least 1 record
        When I attempt to delete the first sale and cancel
        Then the sale should still be in the table
        And I should not see success message "Sale deleted successfully"

    @TC_SALES_UI_ADMIN_12
    Scenario: TC_SALES_UI_ADMIN_12 - Form prevents submission when quantity less than 1
        When I navigate to "/ui/sales/new"
        Then the Sell Plant form should be displayed
        When I select the first plant with stock at least 1
        And I enter quantity "0" in sales form
        Then the quantity input should be invalid
