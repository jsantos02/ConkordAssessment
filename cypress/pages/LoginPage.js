import BasePage from './BasePage';

class LoginPage extends BasePage {
  path = '/';

  selectors = {
    usernameInput: 'username',
    passwordInput: 'password',
    loginButton: 'login-button',
    errorMessage: 'error',
  };

  /** Empty values are skipped so negative scenarios can leave a field blank. */
  typeUsername(username) {
    cy.getByTestId(this.selectors.usernameInput).clear();
    if (username) cy.getByTestId(this.selectors.usernameInput).type(username);
    return this;
  }

  typePassword(password) {
    cy.getByTestId(this.selectors.passwordInput).clear();
    if (password) {
      // `log: false` keeps the password out of the Cypress command log.
      cy.getByTestId(this.selectors.passwordInput).type(password, { log: false });
    }
    return this;
  }

  submit() {
    cy.getByTestId(this.selectors.loginButton).click();
    return this;
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    return this.submit();
  }

  getErrorMessage() {
    return cy.getByTestId(this.selectors.errorMessage);
  }
}

export default new LoginPage();
