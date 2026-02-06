Feature: Category Management UI - Admin Role

  Background:
    Given the admin is logged into the application

  Scenario: Create main and sub categories (TC_01, TC_02)
    When the admin navigates to the Add Category page
    And enters category name "Flowers" and leaves parent empty
    And clicks the Save button
    Then the system redirects to the Category List page
    And the new category "Flowers" should appear in the list

  Scenario: Validate required fields and length constraints (TC_03)
    When the admin navigates to the Add Category page
    And clicks the Save button
    Then a "Category name is required" validation message should appear
    When the admin enters "AB" and clicks Save
    Then a length validation error should be displayed

  Scenario: Update and Delete category (TC_04, TC_05)
    Given a category "Temporary" exists for testing
    When the admin edits that category to "Indoor"
    Then the category should be updated to "Indoor" in the list
    When the admin deletes the category and confirms
    Then the category should be removed from the list