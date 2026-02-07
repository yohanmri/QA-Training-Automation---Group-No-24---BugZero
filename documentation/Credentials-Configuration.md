# Application Credentials and Configuration

## 🔐 Login Credentials

### Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator
- **Permissions:** Full access (Create, Read, Update, Delete)

### Regular User
- **Username:** `testuser`
- **Password:** `test123`
- **Role:** User
- **Permissions:** Read-only access

---

## 🌐 Application URLs

### Base URL
```
http://localhost:8080
```

### Login Page
```
http://localhost:8080/ui/login
```

### Plants Page (after login)
```
http://localhost:8080/ui/plants
```

### API Base URL
```
http://localhost:8080/api
```

### API Login Endpoint
```
POST http://localhost:8080/api/auth/login
```

---

## ⚙️ Cypress Configuration

### Base URL (in cypress.config.js)
```javascript
baseUrl: "http://localhost:8080"
```

### Environment Variables
You can override the base URL using environment variables:
```bash
npx cypress run --env apiBaseUrl=http://localhost:8080
```

---

## 🔧 Custom Commands Usage

### Login Commands (in cypress/support/commands.js)

#### Admin Login
```javascript
cy.loginAsAdmin();
// Logs in with: admin / admin123
```

#### User Login
```javascript
cy.loginAsUser();
// Logs in with: testuser / test123
```

#### Custom Login
```javascript
cy.login('username', 'password');
```

---

## 📝 Feature File Background Steps

### Admin Tests
```gherkin
Background:
    Given user is logged in as "admin"
```

### User Tests
```gherkin
Background:
    Given user is logged in as "user"
```

---

## 🧪 API Testing Credentials

### User API Token
```javascript
Given('I have a valid User JWT token', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/auth/login',
        body: {
            username: 'testuser',
            password: 'test123'
        }
    }).then((response) => {
        userToken = response.body.token;
    });
});
```

### Admin API Token
```javascript
Given('I have a valid Admin JWT token', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/auth/login',
        body: {
            username: 'admin',
            password: 'admin123'
        }
    }).then((response) => {
        adminToken = response.body.token;
    });
});
```

---

## ✅ Files Updated with Correct Credentials

The following files have been updated with the correct credentials:

1. ✅ **cypress/support/commands.js**
   - Updated `loginAsUser()` to use `testuser` / `test123`
   - Admin credentials already correct: `admin` / `admin123`

2. ✅ **cypress/e2e/step_definitions/user/plant-search-filterAPISteps.js**
   - Updated API login to use `testuser` / `test123`

3. ✅ **cypress/e2e/step_definitions/admin/plant-search-filterAPISteps.js**
   - Admin credentials already correct: `admin` / `admin123`

4. ✅ **cypress.config.js**
   - Base URL already correct: `http://localhost:8080`

---

## 🚀 Quick Test

To verify the credentials are working:

### Test Admin Login
```bash
npx cypress open
```
Then run any admin feature file and verify login succeeds.

### Test User Login
```bash
npx cypress open
```
Then run any user feature file and verify login succeeds.

---

## 🔒 Security Notes

⚠️ **Important:** These credentials are for testing purposes only.

- Never commit real production credentials to version control
- Use environment variables for sensitive data in real projects
- Consider using Cypress environment files for different environments

---

## 📋 Checklist Before Running Tests

- [ ] Backend application is running on `http://localhost:8080`
- [ ] Database has test data (plants, categories)
- [ ] Admin user exists: `admin` / `admin123`
- [ ] Regular user exists: `testuser` / `test123`
- [ ] Login page is accessible at `/ui/login`
- [ ] Plants page is accessible at `/ui/plants` (after login)

---

## 🐛 Troubleshooting

### Login Fails
**Symptoms:** Tests fail at login step

**Possible Causes:**
1. Backend not running
2. Wrong credentials
3. Database not initialized
4. Wrong URL

**Solutions:**
1. Start backend: Check if `http://localhost:8080` is accessible
2. Verify credentials in database
3. Check browser console for errors (F12)
4. Verify URL in `cypress.config.js`

### API Tests Fail
**Symptoms:** API tests fail to get token

**Possible Causes:**
1. API endpoint not available
2. Wrong credentials
3. CORS issues

**Solutions:**
1. Test API manually: `curl -X POST http://localhost:8080/api/auth/login -d '{"username":"admin","password":"admin123"}'`
2. Check API logs
3. Verify credentials

---

## 📞 Support

If you encounter credential-related issues:
1. Verify backend is running
2. Check database for user accounts
3. Test login manually in browser
4. Check this configuration file
5. Ask your team leader

---

**Last Updated:** February 5, 2026  
**Project:** QA Training Automation - Group No 24 - BugZero
