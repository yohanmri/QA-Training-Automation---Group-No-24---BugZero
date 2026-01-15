# QA Training App - Test Automation Suite
## Team BugZero - Group 24

### 👥 Team Members
- **Yohan M.R.I.** (215128C) - Team Leader
- **Fathima Sameeha M.J** (215038B)
- **Thathsarani W I B** (214209T)
- **Thennakoon T M P M** (214210M)
- **Rajapaksha R V K J** (215094P)

### 🛠️ Tech Stack
- **UI Testing Framework**: Cypress 13.x
- **BDD Framework**: Cucumber (Gherkin)
- **API Testing**: Cypress + Axios
- **Reporting**: Allure Reports
- **CI/CD**: Jenkins
- **Version Control**: Git & GitHub
- **Language**: JavaScript (Node.js)

### 📋 Prerequisites
Before running this project, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **QA Training App** running on `http://localhost:8080`
- **Git** installed

### 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yohanmri/QA-Training-Automation---Group-No-24---BugZero.git
cd QA-Training-Automation---Group-No-24---BugZero
```

2. **Install dependencies**
```bash
npm install
```

3. **Verify installation**
```bash
npx cypress verify
```

### ▶️ Running Tests

#### Open Cypress Test Runner (Interactive Mode)
```bash
npm run cy:open
```

#### Run all tests in headless mode
```bash
npm run cy:run
```

#### Run tests in Chrome browser
```bash
npm run cy:run:chrome
```

#### Run tests with headed browser
```bash
npm run cy:run:headed
```

#### Generate Allure Report
```bash
npm run allure:report
```

### 📁 Project Structure
```
QA-Training-Automation---Group-No-24---BugZero/
├── cypress/
│   ├── e2e/
│   │   ├── features/              # Cucumber feature files (Gherkin)
│   │   │   ├── admin/             # Admin role test scenarios
│   │   │   ├── user/              # User role test scenarios
│   │   │   └── authentication.feature
│   │   └── step_definitions/      # Step definitions (JavaScript)
│   │       └── authSteps.js
│   ├── support/
│   │   ├── commands.js            # Custom Cypress commands
│   │   ├── e2e.js                 # Global configuration
│   │   └── pageObjects/           # Page Object Models
│   └── fixtures/                  # Test data (JSON files)
├── api-tests/                     # API test scenarios
│   ├── features/
│   └── step_definitions/
├── documentation/                 # Test case & defect documents
├── jenkins/                       # Jenkins pipeline configuration
├── test-results/                  # Test execution results
├── .gitignore
├── cypress.config.js              # Cypress configuration
├── package.json                   # Project dependencies
└── README.md
```

### 🧪 Test Coverage

Each team member is responsible for:
- **10 UI Test Cases** (5 Admin + 5 User role)
- **10 API Test Cases** (5 Admin + 5 User role)

**Modules:**
- Authentication
- Categories Management
- Plants Management
- Sales Management
- Dashboard

### 👤 User Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Regular User:**
- Username: `user`
- Password: `user123`

### 📊 Reporting

Test execution reports are generated using Allure Framework:
- Detailed test results
- Screenshots on failure
- Video recordings
- Step-by-step execution logs

### 🔄 Git Workflow

1. **Create feature branch**
```bash
git checkout -b feature/your-name-module
```

2. **Make changes and commit**
```bash
git add .
git commit -m "Added test cases for categories module"
```

3. **Push to repository**
```bash
git push origin feature/your-name-module
```

4. **Create Pull Request** on GitHub

### 📝 Course Information
- **Course Code**: IS3440 - IT Quality Assurance
- **Institution**: University of Moratuwa
- **Group Number**: 24
- **Final Presentation**: February 7-8, 2026

### 🐛 Bug Reporting
All identified bugs are documented in `/documentation/DefectReport.xlsx`

### 📞 Support
For any issues or questions, contact the team leader:
- **Yohan M.R.I.** - 215128C

### 📄 License
This project is for academic purposes only.

---
**Team BugZero** - Delivering Quality Through Automation 🚀
