Feature: Category Management UI - User Role

  Background:
    Given the user is logged into the application

  Scenario: View category list with pagination (TC_01)
    When the user navigates to the Category List page
    Then the categories table and pagination should be visible

  Scenario: Search categories (TC_02)
    When the user navigates to the Category List page
    When the user searches for "newone"
    Then the table should only show categories containing "newone"

  Scenario: Sort categories (TC_03)
    When the user navigates to the Category List page
    When the user clicks on the "Name" column header
    Then the categories should be sorted alphabetically

  Scenario: Verify Add button is not visible (TC_04)
    When the user navigates to the Category List page
    Then the "Add A Category" button should not be visible

  Scenario: Verify restricted access for User role (TC_05)
    When the user navigates to the Category List page
    # This step now handles the "Visible but Restricted" bugs
    And the Edit and Delete icons should be restricted for the user
    When the user attempts to visit the Add Category URL directly
    Then the user should be redirected to a 403 Forbidden page