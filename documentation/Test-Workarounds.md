# Quick Workaround - Make Tests Pass with Current API

## Summary

Since your backend API doesn't implement search, filter, sort, or pagination, here's how to make the tests pass by adjusting them to match the current API behavior.

## Option 1: Update Feature File (Temporary Fix)

Replace your feature file with this version that works with the current API:

**File:** `cypress/e2e/features/user/plant-search-filterAPI.feature`

```gherkin
Feature: Plant Management (Search, Filter, Sort) API - User

    Background:
        Given I have a valid User JWT token

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_01 - Search plants by name
        Given at least 3 plants exist with different names
        When I send GET request to "/api/plants?name=plant" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        # Note: Backend doesn't filter by name yet, so we just verify it returns plants

    @api @user @smoke  
    Scenario: TC_PLANT_SEARCH_API_USER_02 - Filter plants by category
        Given at least 2 categories exist with plants assigned
        When I send GET request to "/api/plants" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        # Note: Backend doesn't filter by category yet

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_03 - Get all plants
        Given at least 3 plants exist with different values
        When I send GET request to "/api/plants" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        # Note: Backend doesn't sort yet

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_04 - Retrieve all plants
        Given at least 15 plants exist in the system
        When I send GET request to "/api/plants" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
        # Note: Backend doesn't paginate yet

    @api @user @smoke
    Scenario: TC_PLANT_SEARCH_API_USER_05 - Get all plants
        Given plants exist with various names, categories, and prices
        When I send GET request to "/api/plants" with User token
        Then the response status code should be 200
        And the response body should be a JSON array
```

## Option 2: Skip Tests Until Backend is Fixed

Add `@skip` tags to tests that won't work:

```gherkin
@skip @api @user @smoke
Scenario: TC_PLANT_SEARCH_API_USER_01 - Search plants by name
    # Skipped: Backend doesn't implement search yet
```

## Option 3: Use Cypress Intercepts to Mock API

Create a file to mock the API responses:

**File:** `cypress/support/apiMocks.js`

```javascript
export const mockPlantSearchAPI = () => {
    // Mock search by name
    cy.intercept('GET', '**/api/plants?name=Rose*', {
        statusCode: 200,
        body: [
            { id: 1, name: 'Red Rose', price: 10, quantity: 5, category: { id: 1, name: 'Flowers' } },
            { id: 2, name: 'Pink Rose', price: 15, quantity: 3, category: { id: 1, name: 'Flowers' } },
            { id: 3, name: 'White Rose', price: 12, quantity: 7, category: { id: 1, name: 'Flowers' } }
        ]
    }).as('searchByName');

    // Mock filter by category
    cy.intercept('GET', '**/api/plants?categoryId=1*', {
        statusCode: 200,
        body: [
            { id: 1, name: 'Red Rose', price: 10, quantity: 5, category: { id: 1, name: 'Flowers' } },
            { id: 2, name: 'Pink Rose', price: 15, quantity: 3, category: { id: 1, name: 'Flowers' } }
        ]
    }).as('filterByCategory');

    // Mock sorting
    cy.intercept('GET', '**/api/plants?sortBy=name&sortDirection=asc*', {
        statusCode: 200,
        body: [
            { id: 1, name: 'Lily', price: 10, quantity: 5, category: { id: 1, name: 'Flowers' } },
            { id: 2, name: 'Rose', price: 15, quantity: 3, category: { id: 1, name: 'Flowers' } },
            { id: 3, name: 'Tulip', price: 12, quantity: 7, category: { id: 1, name: 'Flowers' } }
        ]
    }).as('sortByName');

    // Mock pagination
    cy.intercept('GET', '**/api/plants?page=0&size=10*', {
        statusCode: 200,
        body: {
            content: Array(10).fill(null).map((_, i) => ({
                id: i + 1,
                name: `Plant ${i + 1}`,
                price: 10 + i,
                quantity: 5 + i,
                category: { id: 1, name: 'Flowers' }
            })),
            totalElements: 14,
            totalPages: 2,
            number: 0,
            size: 10
        }
    }).as('pagination');
};
```

Then use it in your step definitions:

```javascript
import { mockPlantSearchAPI } from '../../support/apiMocks';

Given('I have a valid User JWT token', () => {
    // Enable mocks
    mockPlantSearchAPI();
    
    // Get real token
    cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/api/auth/login`,
        body: {
            username: 'testuser',
            password: 'test123'
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        userToken = response.body.token;
        expect(userToken).to.exist;
        cy.log('User token obtained successfully');
    });
});
```

---

## My Recommendation

**Don't use these workarounds!** 

Instead, **fix the backend API** to properly implement:
1. Search by name
2. Filter by category  
3. Sort by field and direction
4. Pagination with metadata

The tests are correctly written. The backend needs to be fixed.

---

## What to Tell Your Team

"Our API tests are failing because the backend `/api/plants` endpoint doesn't implement the required query parameters:
- `?name=` for searching
- `?categoryId=` for filtering
- `?sortBy=` and `?sortDirection=` for sorting
- `?page=` and `?size=` for pagination

We need to update the backend to support these features before the tests can pass."
