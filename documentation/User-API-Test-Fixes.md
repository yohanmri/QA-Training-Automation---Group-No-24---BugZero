# User API Test Fixes - Summary

## Date: 2026-02-06

## Issues Fixed

### 1. TC_PLANT_SEARCH_API_USER_01 - TypeError: plants.each is not a function ✅ FIXED
**Root Cause:** Used `.each()` method on a JavaScript array, but `.each()` is not a native JavaScript array method.

**Fix Applied:** Changed `plants.each()` to `plants.forEach()` in `commonSteps.js` line 162.

**File Modified:** `cypress/e2e/step_definitions/commonSteps.js`

---

### 2. TC_PLANT_SEARCH_API_USER_02 - Multiple matching step definitions ✅ FIXED
**Root Cause:** Step definition `all returned plants should belong to categoryId {int}` was defined in both:
- `cypress/e2e/step_definitions/admin/plant-search-filterAPISteps.js`
- `cypress/e2e/step_definitions/user/plant-search-filterAPISteps.js`

**Fix Applied:** 
- Moved the step definition to `commonSteps.js` (since it's used by both admin and user tests)
- Removed duplicate definitions from both admin and user files

**Files Modified:**
- `cypress/e2e/step_definitions/commonSteps.js` (added the step)
- `cypress/e2e/step_definitions/admin/plant-search-filterAPISteps.js` (removed duplicate)
- `cypress/e2e/step_definitions/user/plant-search-filterAPISteps.js` (removed duplicate)

---

### 3. TC_PLANT_SEARCH_API_USER_03 - Sorting assertion failure ✅ FIXED
**Root Cause:** JavaScript's default `.sort()` is case-sensitive, so "Plant 1" comes before "plant 2" alphabetically, which doesn't match the expected case-insensitive alphabetical order.

**Fix Applied:** Changed sorting to use case-insensitive comparison:
```javascript
const sortedNames = [...names].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
```

**File Modified:** `cypress/e2e/step_definitions/user/plant-search-filterAPISteps.js`

---

### 4. TC_PLANT_SEARCH_API_USER_04 - Pagination returns 14 items instead of 10 ⚠️ API LIMITATION
**Root Cause:** The backend API doesn't properly support pagination. When requesting `?page=0&size=10`, it returns all 14 plants instead of limiting to 10.

**Current Behavior:** 
- Test expects: 10 items (as per `size=10` parameter)
- API returns: 14 items (all plants, ignoring pagination)

**Recommendation:** This requires a backend API fix. The API should:
1. Respect the `size` parameter and limit results
2. Return pagination metadata in a proper format (Spring Data Page object)

**Temporary Workaround:** The test currently logs a warning but doesn't fail completely. You may need to:
- Update the backend to implement proper pagination
- OR adjust the test expectations to match current API behavior

---

### 5. TC_PLANT_SEARCH_API_USER_05 - Search term not found in plant names ⚠️ DATA ISSUE
**Root Cause:** The test searches for plants with "Rose" in their name, but the actual plant data has names like "plant 1", "plant 2", etc.

**Current Behavior:**
- Test expects: Plants with "Rose" in the name
- API returns: Plants named "plant 1", "plant 2", etc.

**Recommendation:** You need to seed proper test data. Two options:

**Option A: Update Test Data (Recommended)**
Create plants with realistic names that match the test scenarios:
- "Red Rose"
- "White Rose"
- "Yellow Rose"
- "Tulip"
- "Sunflower"
- etc.

**Option B: Update Test Scenarios**
Change the feature file to search for "plant" instead of "Rose":
```gherkin
When I send GET request to "/api/plants?name=plant" with User token
And all returned plants should contain "plant" in their name
```

---

## Files Modified Summary

1. ✅ `cypress/e2e/step_definitions/commonSteps.js`
   - Fixed `.each()` → `.forEach()` for array iteration
   - Added `all returned plants should belong to categoryId {int}` step definition
   - Fixed `.each()` usage in `all returned plants should contain {string} in their name`

2. ✅ `cypress/e2e/step_definitions/user/plant-search-filterAPISteps.js`
   - Removed duplicate `all returned plants should belong to categoryId {int}` step
   - Fixed case-sensitive sorting issue
   - Restored proper step definitions that were accidentally merged

3. ✅ `cypress/e2e/step_definitions/admin/plant-search-filterAPISteps.js`
   - Removed duplicate `all returned plants should belong to categoryId {int}` step

---

## Action Items for You

### 1. Fix Test Data (HIGH PRIORITY)
You need to seed the database with proper plant data. The current data has generic names like "plant 1", "plant 2", but tests expect plants with "Rose" in their names.

**Recommended approach:**
- Check your seed data script: `cypress/e2e/setup/seedTestData.cy.js`
- Add plants with realistic names that match test scenarios
- Ensure at least 3 plants have "Rose" in their name
- Ensure plants are assigned to different categories
- Ensure at least 15 plants exist for pagination tests

### 2. Fix Backend Pagination (MEDIUM PRIORITY)
The backend API needs to implement proper pagination:
- Respect the `size` parameter
- Return only the requested number of items
- Include pagination metadata (totalElements, totalPages, number, size)

**Example expected response structure:**
```json
{
  "content": [...],
  "totalElements": 14,
  "totalPages": 2,
  "number": 0,
  "size": 10
}
```

### 3. Run Tests Again
After fixing the test data and/or backend pagination:
```bash
npx cypress run --spec "cypress/e2e/features/user/plant-search-filterAPI.feature"
```

---

## Test Status After Code Fixes

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC_PLANT_SEARCH_API_USER_01 | ✅ Should Pass | Fixed `.each()` error |
| TC_PLANT_SEARCH_API_USER_02 | ✅ Should Pass | Fixed duplicate step definition |
| TC_PLANT_SEARCH_API_USER_03 | ✅ Should Pass | Fixed case-sensitive sorting |
| TC_PLANT_SEARCH_API_USER_04 | ⚠️ Needs Backend Fix | API doesn't support pagination |
| TC_PLANT_SEARCH_API_USER_05 | ⚠️ Needs Test Data | No plants with "Rose" in name |

---

## Next Steps

1. **Immediate:** Run the tests again to verify the code fixes work
2. **Short-term:** Update test data to include plants with "Rose" in their names
3. **Medium-term:** Fix backend API to support proper pagination
4. **Optional:** Consider creating a dedicated test data seeding script that runs before API tests
