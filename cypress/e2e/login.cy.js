import { loginPage } from '../pages';
import users from '../fixtures/users.json';

describe('Login - negative scenarios', () => {
  const negativeScenarios = [
    { description: 'invalid username and password', user: users.invalidCredentials },
    { description: 'a locked out user', user: users.lockedOut },
    { description: 'an empty username', user: users.missingUsername },
    { description: 'an empty password', user: users.missingPassword },
  ];

  beforeEach(() => {
    loginPage.visit();
  });

  negativeScenarios.forEach(({ description, user }) => {
    it(`rejects login attempt with ${description}`, () => {
      loginPage.login(user.username, user.password);

      loginPage.getErrorMessage().should('be.visible').and('have.text', user.expectedError);
      // The user must remain on the login page and never reach the inventory.
      cy.location('pathname').should('eq', loginPage.path);
    });
  });
});
