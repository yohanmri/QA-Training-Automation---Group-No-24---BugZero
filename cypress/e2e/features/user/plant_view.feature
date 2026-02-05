Feature: Plant Viewing - User UI

  Background:
    Given the user is logged into the application

  Scenario: View plants and test pagination (TC_PLANT_UI_USER_01)
    When the user navigates to the Plants List page
    Then the plants table should be visible
    And the user clicks the Next page control
    Then the next page of plants should be displayed

  Scenario: View plant details (TC_PLANT_UI_USER_02)   
    When the user navigates to the Plants List page
    And clicks on the first plant row
    Then the plant details modal or page should display with Name, Category, Price and Quantity

  Scenario: Verify restricted access for user role (TC_PLANT_UI_USER_03, 04, 05)
    When the user navigates to the Plants List page
    Then the "Add Plant" button should not be visible
    And the Edit and Delete actions should not be visible
    When the user attempts to access the Add Plant URL directly
    Then the user should be redirected to a 403 error page