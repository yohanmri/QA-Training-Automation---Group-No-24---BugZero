Feature: Category Management UI - Admin Role

  Background:
    Given the admin is logged into the application

  Scenario: Create main category (TC_01)
    When the admin navigates to the Add Category page
    And enters category name "Flowers" and leaves parent empty
    And clicks the Save button
    Then the system redirects to the Category List page
    And the new category "Flowers" should appear in the list

  Scenario: Create sub-category (TC_02)
    Given a category "Parent" exists for testing
    When the admin navigates to the Add Category page
    And enters category name "SubCat" and selects the previous category as parent
    And clicks the Save button
    Then the system redirects to the Category List page

  Scenario: Validate required fields and length constraints (TC_03)
    When the admin navigates to the Add Category page
    And clicks the Save button
    Then a "Category name is required" validation message should appear
    When the admin enters "AB" and clicks Save
    Then a length validation error should be displayed

  Scenario: Update category (TC_04)
    Given a category "Temporary" exists for testing
    When the admin edits that category to "Indoor"
    Then the category should be updated to "Indoor" in the list

  Scenario: Delete category (TC_05)
    Given a category "Temporary" exists for testing
    When the admin deletes the category and confirms
    Then the category should be removed from the list