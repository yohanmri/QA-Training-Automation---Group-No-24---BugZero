# UI Test Automation - Quick Reference Cheat Sheet

## 🚀 Quick Commands

### Run Tests
```bash
# Run all UI tests
npx cypress run --spec "cypress/e2e/features/**/*UI.feature"

# Run user tests only
npx cypress run --spec "cypress/e2e/features/user/plant-search-filterUI.feature"

# Run admin tests only
npx cypress run --spec "cypress/e2e/features/admin/plant-search-filterUI.feature"

# Open Cypress Test Runner (GUI)
npx cypress open

# Run with specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### Run by Tags
```bash
# Run all smoke tests
npx cypress run --env tags="@smoke"

# Run user UI tests
npx cypress run --env tags="@ui and @user"

# Run admin UI tests
npx cypress run --env tags="@ui and @admin"
```

---

## 📁 File Locations Quick Reference

| File Type | Location | Purpose |
|-----------|----------|---------|
| **Feature Files** | `cypress/e2e/features/user/` or `/admin/` | Test scenarios in Gherkin |
| **Step Definitions** | `cypress/e2e/step_definitions/user/` or `/admin/` | Step implementations |
| **Common Steps** | `cypress/e2e/step_definitions/commonSteps.js` | Shared steps (login, etc.) |
| **Page Objects** | `cypress/support/pageObjects/` | Page-specific methods |
| **Custom Commands** | `cypress/support/commands.js` | Reusable commands |
| **Config** | `cypress.config.js` | Cypress configuration |

---

## 🎯 Test Case Mapping

### User UI Tests
| Test ID | Feature File Line | Description |
|---------|-------------------|-------------|
| TC_PLANT_SEARCH_UI_USER_01 | Line 7 | Search plants by name |
| TC_PLANT_SEARCH_UI_USER_02 | Line 18 | Filter plants by category |
| TC_PLANT_SEARCH_UI_USER_03 | Line 28 | Sort plants by Name |
| TC_PLANT_SEARCH_UI_USER_04 | Line 38 | Sort by Price and Quantity |
| TC_PLANT_SEARCH_UI_USER_05 | Line 52 | Display "Low" badge |

### Admin UI Tests
| Test ID | Feature File Line | Description |
|---------|-------------------|-------------|
| TC_PLANT_SEARCH_UI_ADMIN_01 | Line 7 | Search with admin actions |
| TC_PLANT_SEARCH_UI_ADMIN_02 | Line 19 | Reset search and filters |
| TC_PLANT_SEARCH_UI_ADMIN_03 | Line 30 | Filter + sort combination |
| TC_PLANT_SEARCH_UI_ADMIN_04 | Line 40 | Pagination with search |
| TC_PLANT_SEARCH_UI_ADMIN_05 | Line 52 | No results message |

---

## 🔑 Key Code Snippets

### Import Page Objects
```javascript
import PlantsListPage from "../../../support/pageObjects/PlantsListPage";
const plantsPage = new PlantsListPage();
```

### Use Page Object Methods
```javascript
// Navigate to plants page
plantsPage.navigateToPlants();

// Search for plants
plantsPage.searchPlants("Rose");

// Sort by column
plantsPage.sortByColumn("Price");

// Verify results
plantsPage.verifyPlantsContainSearchTerm("Rose");
```

### Use Custom Commands
```javascript
// Login commands
cy.loginAsAdmin();
cy.loginAsUser();
cy.login('username', 'password');

// API login
cy.apiLogin('admin', 'admin123');
```

---

## 🎨 Two Approaches

### Traditional Approach
```javascript
When('I click the plant search button', () => {
    cy.contains('button', 'Search').click();
    cy.wait(500);
});
```

### POM Approach
```javascript
When('I click the plant search button', () => {
    plantsPage.searchButton.click();
    cy.wait(500);
});
```

**Recommendation:** Use POM approach for better maintainability!

---

## 🔍 Common Selectors

```javascript
// Search box
cy.get('input[placeholder*="Search"], input[name="search"]')

// Search button
cy.contains('button', 'Search')

// Reset button
cy.contains('button', 'Reset')

// Category dropdown
cy.get('select[name="category"], select').first()

// Table
cy.get('table')
cy.get('table tbody tr')
cy.get('table thead th')

// Column header
cy.contains('th', 'Name')
cy.contains('th', 'Price')

// Admin buttons
cy.contains('button', 'Add Plant')
cy.get('button, a').filter(':contains("Edit")')
cy.get('button, a').filter(':contains("Delete")')
```

---

## ✅ Verification Examples

```javascript
// Verify page displayed
cy.url().should('include', '/plants');
cy.contains('Plants').should('be.visible');

// Verify element visible
cy.get('input[name="search"]').should('be.visible');

// Verify table has data
cy.get('table tbody tr').should('have.length.greaterThan', 0);

// Verify text contains
cy.get('table tbody tr').each(($row) => {
    cy.wrap($row).should('contain.text', 'Rose');
});

// Verify input value
cy.get('input[name="search"]').should('have.value', '');

// Verify sorting
const names = [];
cy.get('table tbody tr td:nth-child(2)').each(($cell) => {
    names.push($cell.text().trim());
}).then(() => {
    const sorted = [...names].sort();
    expect(names).to.deep.equal(sorted);
});
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Element not found | Add `cy.wait(500)` or use `.should('be.visible')` |
| Step not found | Check step text matches exactly in feature file |
| Login fails | Verify backend is running, check credentials |
| Flaky tests | Add explicit waits, check for race conditions |
| Import error | Check file paths, use relative paths correctly |

---

## 📊 Test Execution Checklist

- [ ] Backend application is running
- [ ] Database has test data
- [ ] Cypress is installed (`npm install`)
- [ ] Feature files are in correct location
- [ ] Step definitions match feature steps
- [ ] Page objects are imported correctly
- [ ] Custom commands are defined in `commands.js`

---

## 🎓 Best Practices

1. **Use Page Objects** for better maintainability
2. **Add waits** when elements load dynamically
3. **Use descriptive variable names**
4. **Keep step definitions simple** - logic goes in Page Objects
5. **Use custom commands** for repeated actions
6. **Add comments** to complex logic
7. **Follow naming conventions** consistently
8. **Use tags** to organize tests (@smoke, @regression, etc.)

---

## 📞 Quick Help

**Can't find a file?**
- Use `Ctrl+P` in VS Code to search files

**Need to debug?**
- Add `cy.pause()` in your test
- Use `cy.debug()` to inspect elements
- Check browser console (F12)

**Test failing?**
- Check screenshots in `cypress/screenshots/`
- Watch videos in `cypress/videos/`
- Read error messages carefully

---

**Print this page for quick reference! 📄**
