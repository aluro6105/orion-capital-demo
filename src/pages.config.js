/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import Admin from './pages/Admin';
import Awards from './pages/Awards';
import Chart from './pages/Chart';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import portalCharts from './pages/Portal_Charts';
import portalFunding from './pages/Portal_Funding';
import portalKyc from './pages/Portal_KYC';
import portalMessages from './pages/Portal_Messages';
import portalPortfolio from './pages/Portal_Portfolio';
import portalReports from './pages/Portal_Reports';
import portalSettings from './pages/Portal_Settings';
import portalSupport from './pages/Portal_Support';
import portalTrades from './pages/Portal_Trades';
import Portfolio from './pages/Portfolio';
import Product from './pages/Product';
import Settings from './pages/Settings';
import Summary from './pages/Summary';
import Testimonials from './pages/Testimonials';
import Trades from './pages/Trades';
import CRM from './pages/CRM';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Admin": Admin,
    "Awards": Awards,
    "Chart": Chart,
    "Dashboard": Dashboard,
    "Explore": Explore,
    "FAQ": FAQ,
    "Home": Home,
    "Portal_Charts": portalCharts,
    "Portal_Funding": portalFunding,
    "Portal_KYC": portalKyc,
    "Portal_Messages": portalMessages,
    "Portal_Portfolio": portalPortfolio,
    "Portal_Reports": portalReports,
    "Portal_Settings": portalSettings,
    "Portal_Support": portalSupport,
    "Portal_Trades": portalTrades,
    "Portfolio": Portfolio,
    "Product": Product,
    "Settings": Settings,
    "Summary": Summary,
    "Testimonials": Testimonials,
    "Trades": Trades,
    "CRM": CRM,
}

export const pagesConfig = {
    mainPage: "Chart",
    Pages: PAGES,
    Layout: __Layout,
};