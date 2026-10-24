/**
 * Base class shared by every Page Object.
 * Holds the elements common to all authenticated pages (header, cart icon, title).
 */
export default class BasePage {
  /** Relative path of the page; overridden by subclasses. */
  path = '/';

  baseSelectors = {
    pageTitle: 'title',
    cartLink: 'shopping-cart-link',
    cartBadge: 'shopping-cart-badge',
  };

  visit() {
    cy.visit(this.path);
    return this;
  }

  getPageTitle() {
    return cy.getByTestId(this.baseSelectors.pageTitle);
  }

  getCartBadge() {
    return cy.getByTestId(this.baseSelectors.cartBadge);
  }

  openCart() {
    cy.getByTestId(this.baseSelectors.cartLink).click();
  }

  /** Asserts the browser is on this page and, optionally, that the header title matches. */
  assertIsOpen(expectedTitle) {
    cy.location('pathname').should('eq', this.path);
    if (expectedTitle) {
      this.getPageTitle().should('have.text', expectedTitle);
    }
    return this;
  }
}
