/**
 * Custom command to query elements by their `data-test` attribute.
 * Sauce Demo exposes `data-test` on every interactive element, which makes it
 * the most resilient selector strategy (decoupled from CSS classes and layout).
 *
 * @example cy.getByTestId('login-button')
 */
Cypress.Commands.add('getByTestId', (testId, options) => {
  return cy.get(`[data-test="${testId}"]`, options);
});
