# Conkord Assessment – Sauce Demo Cypress Automation

End-to-end test automation for the [Sauce Demo](https://www.saucedemo.com/) e-commerce platform, built with **Cypress** and the **Page Object Model** design pattern.

## What is covered

| Spec | Scenario | Type |
| --- | --- | --- |
| `cypress/e2e/checkout.cy.js` | Full checkout: Login → Add to Cart → Cart review → Customer information → Overview (price validation) → Confirmation | Positive / E2E |
| `cypress/e2e/login.cy.js` | Invalid credentials, locked out user, empty username, empty password | Negative |

The required negative scenario is the **invalid login attempt**. The other three negative cases reuse the same data-driven test at no extra maintenance cost, so they are included as well.

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | **20 or newer** (tested with 24.20.0 LTS) | Cypress 16 does not support Node 18. npm comes bundled with Node. |
| Google Chrome *(optional)* | any recent version | Recommended browser. Cypress also ships with Electron, which works out of the box. |
| Mozilla Firefox *(optional)* | any recent version | Only needed for `npm run test:firefox` and `npm run test:firefox:headed`. |

Check your versions:

```bash
node -v
npm -v
```

If Node.js is missing or older than 20, install the LTS version from <https://nodejs.org/>, or on Windows:

```bash
winget install --id OpenJS.NodeJS.LTS -e
```

Open a **new** terminal after installing so the updated `PATH` is picked up.

## Installation

1. Clone or copy the project and go to its folder:

   ```bash
   cd ConkordAssessment
   ```

2. Install the npm dependencies (Cypress is the only dependency):

   ```bash
   npm install
   ```

3. Make sure the Cypress binary is installed and working:

   ```bash
   npx cypress install
   ```

## Running the tests

| Command | What it does |
| --- | --- |
| `npm test` | Runs all specs headless in the bundled Electron browser |
| `npm run test:chrome` | Runs all specs headless in Google Chrome (recommended) |
| `npm run test:firefox` | Runs all specs headless in Mozilla Firefox |
| `npm run test:firefox:headed` | Runs all specs in a visible Firefox window so you can watch each step |
| `npm run test:checkout` | Runs only the E2E checkout spec |
| `npm run test:login` | Runs only the negative login spec |
| `npm run cy:open` | Opens the interactive Cypress Test Runner |

Example:

```bash
npm test
```

On Windows you can also double-click `run-tests.cmd`: it checks Node/npm, runs `npm install`, installs and verifies the Cypress binary, runs `npm test`, and saves all output to `run-log.txt`.

Expected result:

```
  ✔  checkout.cy.js     1 test    1 passing
  ✔  login.cy.js        4 tests   4 passing
  ✔  All specs passed!  5 tests   5 passing
```

On failure, Cypress saves screenshots to `cypress/screenshots/` (git-ignored).

### Running in the interactive runner

```bash
npm run cy:open
```

Choose **E2E Testing**, pick a browser, then click a spec to watch it run.

## Project structure

```
ConkordAssessment/
├── cypress/
│   ├── e2e/                         # Test specs: test logic and assertions only
│   │   ├── checkout.cy.js
│   │   └── login.cy.js
│   ├── fixtures/                    # Test data, kept apart from the code
│   │   ├── checkout.json            # Customer data, products, confirmation messages
│   │   └── users.json               # Credentials and expected error messages
│   ├── pages/                       # Page Objects: selectors and page interactions
│   │   ├── BasePage.js              # Shared header elements (title, cart) and helpers
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutInformationPage.js
│   │   ├── CheckoutOverviewPage.js
│   │   ├── CheckoutCompletePage.js
│   │   └── index.js                 # Single import point for all page objects
│   └── support/
│       ├── commands.js              # Custom command: cy.getByTestId()
│       └── e2e.js
├── cypress.config.js
├── package.json
└── README.md
```

## Design decisions

### Page Object Model

- Each page of the application has a class in `cypress/pages/`. It holds that page's **selectors** in a `selectors` map and exposes **intent-revealing methods** such as `login()`, `addProductToCart()` and `fillCustomerInformation()`.
- Specs never contain raw selectors. If the UI changes, only the matching page object needs updating.
- `BasePage` holds the elements shared by every authenticated page (page title, cart link, cart badge) and a reusable `assertIsOpen()` check, so this logic is not duplicated.
- Page objects are exported as singletons through `pages/index.js`, which keeps spec imports short.
- Page objects perform actions and expose elements. Assertions stay in the specs, so each test states clearly what it checks.

### Resilient selectors

- All selectors use the `data-test` attributes that Sauce Demo exposes on its interactive elements, wrapped in the custom command `cy.getByTestId('...')`. These attributes are meant for testing, so they do not change with styling, CSS classes or DOM layout.
- Products are found **by their visible name** and then scoped to their own product card, instead of using hard-coded IDs such as `add-to-cart-sauce-labs-backpack`. Adding a different product only requires editing `fixtures/checkout.json`.
- No `cy.wait(<ms>)` calls are used. The tests rely on Cypress's built-in retry-ability and assertions such as `should('have.text', ...)`.

### Test data

- Credentials, customer data, product names and expected messages live in `cypress/fixtures/`, separate from the test logic.
- The negative login spec is **data-driven**: adding a new invalid-login case only requires a new fixture entry.

### Reliability

- Each test starts from a clean state. Cypress clears cookies and local storage between tests, and the checkout test logs in again in `beforeEach`.
- `retries.runMode: 1` re-runs a failed test once in `cypress run`, which absorbs network flakiness from the public demo site. Retries are disabled in interactive mode so real failures stay visible during development.
- The password is typed with `{ log: false }` so it does not appear in the Cypress command log.

## Assumptions

The requirements left some gaps. These are the assumptions I made:

1. **Which products to buy.** The requirements do not say which or how many products to add. The test buys **two** products (`Sauce Labs Backpack` and `Sauce Labs Bike Light`), which covers the multi-item cart logic and the cart badge count better than a single item. The list can be changed in `fixtures/checkout.json`.
2. **Customer information.** No checkout data was provided. Placeholder values (`John`, `Doe`, `10001`) are used, because the form only requires non-empty values.
3. **What "Confirmation" means.** The flow counts as successfully confirmed when the **Checkout: Complete!** page is shown, the header reads **"Thank you for your order!"**, the confirmation text is shown and the cart badge is cleared (the cart was emptied).
4. **Extra validations.** Besides navigation, the E2E test checks that the cart and overview list the selected products and that **item total = sum of product prices** and **total = item total + tax**. The exact tax value is not hard-coded, because the tax rate is a business rule that may change. Checking the arithmetic is more robust.
5. **Negative scenario scope.** "One negative scenario" is covered by the invalid login test. The other three login failures are included because they cost almost nothing to maintain.
6. **Login strategy.** Login goes through the UI each time, since testing the login is part of the required flow. In a larger suite, `cy.session()` or a programmatic login could speed up tests where login is only a precondition.
7. **Credentials in the repository.** `standard_user` / `secret_sauce` are public demo credentials published on the Sauce Demo login page, so storing them in a fixture is acceptable here. For a real application, credentials would come from environment variables (`Cypress.env()`) or a secrets manager, never from version control.
8. **Language and tooling.** Plain JavaScript (CommonJS config, ES modules in specs) keeps the setup minimal with no transpilation step. TypeScript would be a natural next step for a larger project.
9. **Browser.** The default `npm test` uses the Electron browser that ships with Cypress, so the tests run with no extra install. Cypress 16 marks Electron as deprecated, so `npm run test:chrome` is provided and recommended when Chrome is available.
10. **Target environment.** Tests run against the public production URL `https://www.saucedemo.com`, set as `baseUrl` in `cypress.config.js`. It can be overridden without code changes:

    ```bash
    npx cypress run --config baseUrl=https://another-env.example.com
    ```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Cypress executable not found` / `No version of Cypress is installed` | Run `npx cypress install`. |
| Errors about an unsupported Node version | Install Node.js 20+ and open a new terminal. |
| `npm run test:chrome` says the browser was not found | Install Google Chrome, or use `npm test` (Electron). |
| Tests time out loading the site | Check your internet connection and that <https://www.saucedemo.com> is reachable. |
