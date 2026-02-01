Feature: Sales - Admin Role

  Background:
    Given user is logged in as "admin"

  Scenario: TC_SALES_UI_ADMIN_01 - Verify that the “Sell Plant” button is visible on Sales List page for Admin role
    Given admin navigates to the "Sales" page
    Then validate "Sell Plant" button is visible and enabled
    And validate sales actions column is visible

  Scenario: TC_SALES_UI_ADMIN_02 - Verify that an Admin can create a sale successfully and inventory stock reduces after sale
    Given admin navigates to the "Sales" page
    When admin navigates to Sell Plant page
    Then validate Sell Plant form is displayed
    When admin selects the first plant with stock at least 1
    And admin enters quantity "1"
    And admin clicks Sell button
    Then admin should be redirected to "/ui/sales"
    And validate newly created sale row exists for selected plant and quantity "1"
    When admin navigates to the "Plants" page
    Then validate selected plant stock is reduced by "1"

  Scenario: TC_SALES_UI_ADMIN_03 - Verify that Sell Plant form validation works for mandatory Plant selection and Quantity >= 1
    When admin navigates to Sell Plant page
    Then validate Sell Plant form is displayed

    When admin leaves plant unselected
    And admin enters quantity "1"
    And admin clicks Sell button
    Then validate text "Plant is required" is displayed

    When admin selects the first plant with stock at least 1
    And admin enters quantity "0"
    Then validate quantity input is invalid

    When admin enters quantity "1"
    And admin clicks Sell button
    Then admin should be redirected to "/ui/sales"

  Scenario: TC_SALES_UI_ADMIN_04 - Verify that the Cancel action on Sell Plant page navigates back to Sales List without creating a sale
    Given admin navigates to the "Sales" page
    When admin captures current sales row count
    And admin navigates to Sell Plant page
    Then validate Sell Plant form is displayed
    When admin selects the first plant with stock at least 1
    And admin enters quantity "1"
    And admin clicks Cancel button
    Then admin should be redirected to "/ui/sales"
    And validate sales row count is unchanged

  Scenario: TC_SALES_UI_ADMIN_05 - Verify that an Admin can delete a sale only after confirming the confirmation prompt
    Given user is logged in as "admin"
    And user navigates to the "Sales" page
    Then validate Sales table has at least 1 record

    When admin deletes the first sale after confirming
    Then validate sale deleted success alert is displayed
    And validate the sale record is removed from the list

