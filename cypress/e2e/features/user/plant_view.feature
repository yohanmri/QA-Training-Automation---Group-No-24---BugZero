Feature: Plant Viewing - User UI

  Background:
    Given the user is logged into the application

  Scenario: View plants with pagination (TC_PLANT_UI_USER_01)
    When the user navigates to the Plants List page
    Then the Plants List page should be displayed
    And the plants table should be visible
    And at least one plant row should be displayed
    And pagination controls should be visible
    When the user clicks the Next page control
    Then the next page of plants should be displayed
    And the current page indicator should update accordingly

  Scenario: View plant details (TC_PLANT_UI_USER_02)   
    When the user navigates to the Plants List page
    Then at least one plant record should be visible in the table
    When clicks on the first plant row
    Then the plant details modal or page should display with Name, Category, Price and Quantity

  Scenario: Verify "Add Plant" button is not visible for User role (TC_PLANT_UI_USER_03)
    When the user navigates to the Plants List page
    Then the Plants List page should be displayed
    And the "Add Plant" button should not be visible

  Scenario: Verify Edit and Delete actions are not visible for User role (TC_PLANT_UI_USER_04)
    When the user navigates to the Plants List page
    Then the plants table should display plant records
    And the Edit and Delete actions should not be visible

  Scenario: Prevent User from accessing Add Plant page via direct URL (TC_PLANT_UI_USER_05)
    When the user attempts to access the Add Plant URL directly
    Then the user should be redirected to a 403 error page
    And the Add Plant form should not be accessible