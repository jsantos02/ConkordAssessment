import BasePage from './BasePage';

/** Extracts the trailing monetary value from labels such as "Item total: $39.98". */
const parseAmount = (text) => parseFloat(text.split('$')[1]);

class CheckoutOverviewPage extends BasePage {
  path = '/checkout-step-two.html';
  title = 'Checkout: Overview';

  selectors = {
    itemName: 'inventory-item-name',
    subtotalLabel: 'subtotal-label',
    taxLabel: 'tax-label',
    totalLabel: 'total-label',
    finishButton: 'finish',
  };

  getItemNames() {
    return cy.getByTestId(this.selectors.itemName);
  }

  getSubtotal() {
    return cy.getByTestId(this.selectors.subtotalLabel).invoke('text').then(parseAmount);
  }

  getTax() {
    return cy.getByTestId(this.selectors.taxLabel).invoke('text').then(parseAmount);
  }

  getTotal() {
    return cy.getByTestId(this.selectors.totalLabel).invoke('text').then(parseAmount);
  }

  finish() {
    cy.getByTestId(this.selectors.finishButton).click();
  }
}

export default new CheckoutOverviewPage();
