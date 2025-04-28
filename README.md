A TypeScript-based end-to-end testing framework with interchangeable adapters (Playwright, Puppeteer, Cypress, WebdriverIO).

1) Pre-requisites

Before you begin, ensure you have the following installed on your system:

Node.js (v16 or higher) and npm

Git (for version control)

Browsers:

Chromium/Chrome (used by Playwright, Puppeteer, WebdriverIO)

Firefox (optional, for Playwright)

WebDriver (if using WebdriverIO without built-in service)

Optional:

Docker (if you prefer containerized browser instances)

2) Getting Started

Clone the repository

git clone <your-repo-url>
cd browser-adapter-ui-automation-framework

Install dependencies

npm install

Configure environment

Copy .env.example to .env:

cp .env.example .env

Edit .env to set your application’s base URL and flags:

BASE_URL=http://localhost:3000
TEST_ENGINE=playwright   # playwright | puppeteer | cypress | webdriverio
HEADLESS=true            # true | false
SLOWMO=0                 # ms slowdown for visual debugging
SCREENSHOTS_DIR=screenshots

Build (TypeScript compile)

npm run build

3) How to Run Tests

You can run tests against any supported adapter by using the npm scripts:

Playwright

npm run test:playwright

Puppeteer

npm run test:puppeteer

Cypress

npm run test:cypress

WebdriverIO

npm run test:webdriverio

Or run all tests (default engine from .env):

npm test

4) Explanation of Each Test

tests/login.spec.ts (Google Load)

Purpose: Verifies that a browser session can navigate to an external URL.

Flow:

launch(): Starts the configured adapter.

open('https://www.google.com'): Navigates to Google.

getText('title'): Retrieves the page title.

Assertion: Confirms the title contains “google”.

tests/shopping-cart.spec.ts

Purpose: Simulates adding an item to a shopping cart on your application.

Flow:

Navigate to /products (via open('/products')).

Click the first “Add to Cart” button.

Navigate to /cart.

Retrieve .cart-count text and assert it equals 1.

tests/google-search.spec.ts

Purpose: Performs a search on Google and validates search functionality.

Flow:

Navigate to Google.

(Optional) Click the cookie-consent button.

Type “Playwright” into the search box.

Submit the search.

Verify the page title contains “Playwright”.

5) Browser Adapter Concept

This framework abstracts browser controls behind a BrowserAdapter interface:

export interface BrowserAdapter {
  launch(): Promise<void>;
  close(): Promise<void>;
  open(path: string): Promise<void>;
  click(selector: string): Promise<void>;
  type(selector: string, text: string): Promise<void>;
  getText(selector: string): Promise<string>;
  screenshot(path: string): Promise<void>;
}

Adapters: Concrete classes implement this interface for each tool:

PlaywrightAdapter

PuppeteerAdapter

CypressAdapter

WebdriverIOAdapter

Factory: A simple factory reads TEST_ENGINE and returns the appropriate adapter.

Actions: Core test functions (open, click, etc.) delegate to the chosen adapter at runtime. Tests remain engine-agnostic and can switch tools with a single configuration change.

This design promotes:

Flexibility: Swap browsers or frameworks without rewriting tests.

Consistency: Single API for all E2E operations.

Maintainability: Centralized code for setup, teardown, and utilities (logging, screenshots, reporting).

Happy testing! 🎉

