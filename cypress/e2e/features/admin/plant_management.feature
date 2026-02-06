Feature: Plant Management - Admin UI

  Background:
    Given the admin is logged into the application

  Scenario: Successfully open Add Plant page (TC_PLANT_UI_ADMIN_01)
    When the admin navigates to the Add Plant page
    Then the Add Plant page should be displayed

  Scenario: Enter valid plant details (TC_PLANT_UI_ADMIN_02)
    When the admin navigates to the Add Plant page
    And enters valid plant details "new Plant", "testone", "25.50", "10"
    Then all fields should accept the values without validation errors

  Scenario: Save plant with valid data (TC_PLANT_UI_ADMIN_03)
    When the admin navigates to the Add Plant page
    And enters valid plant details "new Plant", "testone", "25.50", "10"
    And clicks the Save button
    Then the plant should be submitted successfully

  Scenario: Redirect after successful plant creation (TC_PLANT_UI_ADMIN_04)
    When the admin navigates to the Add Plant page
    And enters valid plant details "new Plant", "testone", "25.50", "10"
    And clicks the Save button
    Then the system should redirect to the Plants List page

  Scenario: Newly created plant appears in list (TC_PLANT_UI_ADMIN_05)
    When the admin navigates to the Add Plant page
    And enters valid plant details "new Plant", "testone", "25.50", "10"
    And clicks the Save button
    Then the plant "new Plant" should be visible in the list with correct details