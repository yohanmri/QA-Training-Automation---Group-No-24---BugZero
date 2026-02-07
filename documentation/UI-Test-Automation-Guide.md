# UI Test Automation - Complete Implementation Guide

## 📋 Overview
This document provides a complete guide for the UI test automation implementation using Cypress and Cucumber for the Plant Management System.

## 🎯 Test Cases Covered

### **User Role - UI Tests (5 Test Cases)**
1. **TC_PLANT_SEARCH_UI_USER_01** - Search plants by name
2. **TC_PLANT_SEARCH_UI_USER_02** - Filter plants by category
3. **TC_PLANT_SEARCH_UI_USER_03** - Sort plants by Name
4. **TC_PLANT_SEARCH_UI_USER_04** - Sort plants by Price and Quantity
5. **TC_PLANT_SEARCH_UI_USER_05** - Display "Low" badge for low stock

### **Admin Role - UI Tests (5 Test Cases)**
1. **TC_PLANT_SEARCH_UI_ADMIN_01** - Search plants by name (with admin actions visible)
2. **TC_PLANT_SEARCH_UI_ADMIN_02** - Reset search and filters
3. **TC_PLANT_SEARCH_UI_ADMIN_03** - Filter by category and sort by price
4. **TC_PLANT_SEARCH_UI_ADMIN_04** - Pagination with search applied
5. **TC_PLANT_SEARCH_UI_ADMIN_05** - Display "No plants found" when search returns empty

---

## 📁 Complete File Structure

```
QA-Training-Automation---Group-No-24---BugZero/
│
├── cypress/
│   ├── e2e/
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   │   ├── plant-search-filterUI.feature ✅ (Already exists)
│   │   │   │   └── plant-search-filterAPI.feature ✅ (Already exists)
│   │   │   └── user/
│   │   │       ├── plant-search-filterUI.feature ✅ (Already exists)
│   │   │       └── plant-search-filterAPI.feature ✅ (Already exists)
│   │   │
│   │   └── step_definitions/
│   │       ├── commonSteps.js ✅ (CREATED - Login/Background steps)
│   │       ├── admin/
│   │       │   ├── plant-search-filterUISteps.js ✅ (FIXED - Traditional approach)
│   │       │   ├── plant-search-filterUISteps-POM.js ✅ (CREATED - POM approach)
│   │       │   └── plant-search-filterAPISteps.js ✅ (Already exists)
│   │       └── user/
│   │           ├── plant-search-filterUISteps.js ✅ (Already exists)
│   │           ├── plant-search-filterUISteps-POM.js ✅ (CREATED - POM approach)
│   │           └── plant-search-filterAPISteps.js ✅ (Already exists)
│   │
│   ├── support/
│   │   ├── commands.js ✅ (Already exists - Login commands)
│   │   ├── e2e.js ✅ (Already exists)
│   │   └── pageObjects/
│   │       ├── index.js ✅ (CREATED - Central export)
│   │       ├── LoginPage.js ✅ (CREATED)
│   │       └── PlantsListPage.js ✅ (CREATED)
│   │
│   └── fixtures/
│       └── (test data files)
│
├── cypress.config.js ✅ (Already exists)
├── package.json ✅ (Already exists)
└── README.md ✅ (Already exists)
```

---

## 📝 Files Created/Modified

### **1. Common Step Definitions** ✅ CREATED
**File:** `cypress/e2e/step_definitions/commonSteps.js`
- **Purpose:** Handles login and authentication steps used in Background sections
- **Key Steps:**
  - `Given user is logged in as "admin"`
  - `Given user is logged in as "user"`
  - Additional login variations

### **2. Admin UI Step Definitions** ✅ FIXED
**File:** `cypress/e2e/step_definitions/admin/plant-search-filterUISteps.js`
- **Purpose:** Traditional step definitions for admin UI tests
- **Changes:** Removed duplicate code, cleaned up structure
- **Approach:** Direct Cypress commands

### **3. Admin UI Step Definitions (POM)** ✅ CREATED
**File:** `cypress/e2e/step_definitions/admin/plant-search-filterUISteps-POM.js`
- **Purpose:** Page Object Model-based step definitions for admin UI tests
- **Approach:** Uses PlantsListPage class for better maintainability
- **Benefits:** Cleaner code, easier to maintain, reusable methods

### **4. User UI Step Definitions (POM)** ✅ CREATED
**File:** `cypress/e2e/step_definitions/user/plant-search-filterUISteps-POM.js`
- **Purpose:** Page Object Model-based step definitions for user UI tests
- **Approach:** Uses PlantsListPage class
- **Benefits:** Same as admin POM approach

### **5. Plants List Page Object** ✅ CREATED
**File:** `cypress/support/pageObjects/PlantsListPage.js`
- **Purpose:** Centralized page object for Plants List page
- **Contains:**
  - **Selectors:** All element locators
  - **Actions:** Methods like `searchPlants()`, `sortByColumn()`, `resetFilters()`
  - **Assertions:** Methods like `verifyPageDisplayed()`, `verifyTableDisplayed()`

### **6. Login Page Object** ✅ CREATED
**File:** `cypress/support/pageObjects/LoginPage.js`
- **Purpose:** Page object for Login page
- **Contains:**
  - Login methods
  - Credential input methods
  - Verification methods

### **7. Page Objects Index** ✅ CREATED
**File:** `cypress/support/pageObjects/index.js`
- **Purpose:** Central export point for all page objects
- **Usage:** `import { PlantsListPage } from '../support/pageObjects'`

---

## 🚀 How to Run the Tests

### **Run All UI Tests**
```bash
npx cypress run --spec "cypress/e2e/features/**/*UI.feature"
```

### **Run User UI Tests Only**
```bash
npx cypress run --spec "cypress/e2e/features/user/plant-search-filterUI.feature"
```

### **Run Admin UI Tests Only**
```bash
npx cypress run --spec "cypress/e2e/features/admin/plant-search-filterUI.feature"
```

### **Run Specific Test by Tag**
```bash
npx cypress run --env tags="@ui and @user"
npx cypress run --env tags="@ui and @admin"
npx cypress run --env tags="@smoke"
```

### **Run in Headed Mode (See Browser)**
```bash
npx cypress open
```
Then select the feature file you want to run.

---

## 🎨 Two Approaches Available

You now have **TWO approaches** for step definitions:

### **Approach 1: Traditional (Direct Cypress Commands)**
- Files: `plant-search-filterUISteps.js`
- **Pros:** Simple, straightforward, good for beginners
- **Cons:** Code duplication, harder to maintain

### **Approach 2: Page Object Model (POM)**
- Files: `plant-search-filterUISteps-POM.js`
- **Pros:** Cleaner code, reusable, easier to maintain, industry best practice
- **Cons:** Slightly more complex setup

**Recommendation:** Use the **POM approach** for better code quality and maintainability.

---

## 🔧 Configuration

### **Cypress Configuration**
Check `cypress.config.js` for:
- Base URL
- Viewport settings
- Screenshot/video settings
- Cucumber preprocessor settings

### **Environment Variables**
You can set environment variables in `cypress.config.js` or via command line:
```bash
npx cypress run --env apiBaseUrl=http://localhost:8080
```

---

## 📚 Key Concepts

### **Feature Files (.feature)**
- Written in Gherkin syntax
- Located in `cypress/e2e/features/`
- Define test scenarios in human-readable format

### **Step Definitions (.js)**
- Located in `cypress/e2e/step_definitions/`
- Implement the steps defined in feature files
- Use Cypress commands to interact with the application

### **Page Objects (.js)**
- Located in `cypress/support/pageObjects/`
- Encapsulate page-specific selectors and actions
- Promote code reusability and maintainability

### **Custom Commands**
- Located in `cypress/support/commands.js`
- Reusable commands like `cy.loginAsAdmin()`
- Available throughout all tests

---

## 🧪 Test Execution Flow

1. **Background Step** → Login as user/admin (from `commonSteps.js`)
2. **Given Steps** → Set up preconditions (data exists)
3. **When Steps** → Perform actions (navigate, search, filter, sort)
4. **Then Steps** → Verify expected results (assertions)

---

## 📊 Test Reports

After running tests, you can find:
- **Screenshots:** `cypress/screenshots/` (on failure)
- **Videos:** `cypress/videos/` (full test execution)
- **Console Output:** Terminal shows pass/fail status

---

## 🐛 Troubleshooting

### **Issue: Step definition not found**
- **Solution:** Make sure step definitions match exactly with feature file steps
- Check for typos in step text

### **Issue: Element not found**
- **Solution:** Check selectors in Page Objects or step definitions
- Use `cy.wait()` if elements load slowly
- Verify the application is running

### **Issue: Login fails**
- **Solution:** Check credentials in `commands.js`
- Verify the application backend is running
- Check the login URL in `commands.js`

### **Issue: Tests fail randomly**
- **Solution:** Add appropriate `cy.wait()` statements
- Use `should('be.visible')` before interacting with elements
- Check for race conditions

---

## ✅ Next Steps

1. **Run the tests** to verify everything works
2. **Review test results** and fix any failures
3. **Customize selectors** in Page Objects if needed (based on your actual application)
4. **Add more test data** in fixtures if required
5. **Integrate with CI/CD** (Jenkins, GitHub Actions, etc.)

---

## 📖 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

---

## 👥 Team Information

- **Project:** QA Training Automation - Group No 24 - BugZero
- **Framework:** Cypress + Cucumber (BDD)
- **Pattern:** Page Object Model (POM)
- **Language:** JavaScript

---

## 📞 Support

If you encounter any issues:
1. Check this documentation
2. Review the code comments in each file
3. Check Cypress documentation
4. Ask your team leader

---

**Good luck with your assignment! 🎉**
