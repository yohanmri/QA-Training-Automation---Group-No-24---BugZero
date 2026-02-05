
// Login command
Cypress.Commands.add('login', (username, password) => {
    cy.visit('/ui/login');
    cy.get('input[name="username"]').clear().type(username);
    cy.get('input[name="password"]').clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
});

// Admin login shortcut
Cypress.Commands.add('loginAsAdmin', () => {
    cy.login('admin', 'admin123');
});

// User login shortcut
Cypress.Commands.add('loginAsUser', () => {
    cy.login('testuser','test123');
});

// API login command
Cypress.Commands.add('apiLogin', (username, password) => {
    return cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { username, password },
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 200 && response.body.token) {
            window.localStorage.setItem('token', response.body.token);
            return response.body.token;
        }
        return null;
    });
});

// API request with authentication
Cypress.Commands.add('apiRequest', (method, url, body = null, token = null) => {
    const options = {
        method: method,
        url: url,
        failOnStatusCode: false
    };

    if (token) {
        options.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    if (body) {
        options.body = body;
    }

    return cy.request(options);
});

// Wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
    cy.wait(1000);
});

// Check if element exists
Cypress.Commands.add('elementExists', (selector) => {
    cy.get('body').then($body => {
        return $body.find(selector).length > 0;
    });
});
