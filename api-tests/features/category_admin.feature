Feature: Category Management API - Admin Role

  Background:
    Given I am authenticated as an "admin" via API

  Scenario: Create main category successfully (TC_CATEGORY_API_ADMIN_01)
    When I create a main category with name "Flowers"
    Then the response status code should be 201
    And the response body should contain "id", "name", and "subCategories"

  Scenario: Create sub-category successfully (TC_CATEGORY_API_ADMIN_02)
    When I create a main category with name "Flowers"
    And I create a sub-category "Roses" under the previous category
    Then the response status code should be 201
    And the response body should contain "id", "name", and "subCategories"

  Scenario: Reject invalid category names (TC_CATEGORY_API_ADMIN_03)
    Then the system should reject these invalid names with 400 Bad Request:
      | Name             | Reason            |
      |                  | Empty name        |
      | AB               | Too short (<3)    |
      | VeryLongName123  | Too long (>10)    |

  Scenario: Update existing category name (TC_CATEGORY_API_ADMIN_04)
    When I create a main category with name "OldName"
    And I update the existing category name to "Indoor"
    Then the response status code should be 200
    And the category name should be updated to "Indoor"

  Scenario: Delete category successfully (TC_CATEGORY_API_ADMIN_05)
    When I create a main category with name "Trash"
    And I delete the category
    Then the response status code should be 204
    When I send a GET request to the created category ID
    Then the response status code should be 404