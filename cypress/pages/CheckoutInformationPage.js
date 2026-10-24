import BasePage from './BasePage';

class CheckoutInformationPage extends BasePage {
  path = '/checkout-step-one.html';
  title = 'Checkout: Your Information';

  selectors = {
    firstNameInput: 'firstName',
    lastNameInput: 'lastName',
    postalCodeInput: 'postalCode',
    continueButton: 'continue',
  };

  fillCustomerInformation({ firstName, lastName, postalCode }) {
    cy.getByTestId(this.selectors.firstNameInput).clear().type(firstName);
    cy.getByTestId(this.selectors.lastNameInput).clear().type(lastName);
    cy.getByTestId(this.selectors.postalCodeInput).clear().type(postalCode);
    return this;
  }

  continue() {
    cy.getByTestId(this.selectors.continueButton).click();
  }
}

export default new CheckoutInformationPage();
