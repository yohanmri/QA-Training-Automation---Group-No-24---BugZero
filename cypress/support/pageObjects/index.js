/**
 * Page Objects Index
 * Central export point for all Page Object Models
 * Usage: import { LoginPage, PlantsListPage } from '../support/pageObjects';
 */

import LoginPage from './LoginPage';
import PlantsListPage from './PlantsListPage';

export {
    LoginPage,
    PlantsListPage
};

// Default export for convenience
export default {
    LoginPage,
    PlantsListPage
};
