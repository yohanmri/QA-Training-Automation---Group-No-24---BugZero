# Test Data Setup

This folder contains scripts to seed test data before running UI and API tests.

## Quick Start

### Seed All Test Data
```bash
npx cypress run --spec "cypress/e2e/setup/seedTestData.cy.js"
```

This will create:
- 4 plants with "Tulip" in their names
- 6 general plants (Rose, Lily, Daisy, etc.)
- 15 plants with "Rose" in their names (for pagination testing)

## What Gets Created

| Plant Name Pattern | Count | Purpose |
|-------------------|-------|---------|
| Tulip, Tulip Red, etc. | 4 | Search functionality testing |
| Rose, Lily, Daisy, etc. | 6 | General UI testing |
| Rose 1, Rose 2, ... Rose 15 | 15 | Pagination testing |

## Prerequisites

1. **Backend Server Running:** Ensure the backend is running at `http://localhost:8080`
2. **Categories Exist:** At least one category must exist in the database
3. **Admin Access:** Admin credentials must work (admin/admin123)

## Troubleshooting

### "No categories found" Error
**Solution:** Create at least one category through the admin UI or API before running the setup script.

### "Failed to create plant" Warning
**Possible Causes:**
- Plant with that name already exists (this is okay, script will continue)
- No categories in database
- Backend server not running
- Authentication failed

### Verify Data Was Created
After running the setup script, check the last test output:
```
✅ Total plants in database: X
✅ Plants with "Tulip": Y
✅ Plants with "Rose": Z
```

## Manual Data Seeding

If you prefer to seed data manually or in your own tests:

```javascript
import { seedPlantsWithNames, seedPlantsWithPattern } from '../../support/testDataHelper';

// In your test file
before(() => {
    // Seed specific plants
    seedPlantsWithNames(['Tulip', 'Rose', 'Lily']);
    
    // Or seed with a pattern
    seedPlantsWithPattern('Rose', 10); // Creates Rose 1, Rose 2, ..., Rose 10
});
```

## Cleanup

To delete all plants after testing:

```javascript
import { deleteAllPlants } from '../../support/testDataHelper';

after(() => {
    deleteAllPlants();
});
```

## Related Documentation

- **Test Data Requirements:** `documentation/Test-Data-Requirements.md`
- **Test Fixes Summary:** `documentation/Test-Fixes-Summary.md`
- **Test Data Helper:** `cypress/support/testDataHelper.js`
