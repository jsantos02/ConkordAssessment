import BasePage from './BasePage';

class CheckoutCompletePage extends BasePage {
  path = '/checkout-complete.html';
  title = 'Checkout: Complete!';

  selectors = {
    completeHeader: 'complete-header',
    completeText: 'complete-text',
    backHomeButton: 'back-to-products',
  };

  getConfirmationHeader() {
    return cy.getByTestId(this.selectors.completeHeader);
  }

  getConfirmationText() {
    return cy.getByTestId(this.selectors.completeText);
  }

  backHome() {
    cy.getByTestId(this.selectors.backHomeButton).click();
  }
}

export default new CheckoutCompletePage();
