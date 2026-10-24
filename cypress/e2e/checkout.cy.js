import {
  loginPage,
  inventoryPage,
  cartPage,
  checkoutInformationPage,
  checkoutOverviewPage,
  checkoutCompletePage,
} from '../pages';

describe('End-to-End Checkout flow', () => {
  let users;
  let checkoutData;

  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
    cy.fixture('checkout').then((data) => {
      checkoutData = data;
    });
  });

  beforeEach(() => {
    loginPage.visit();
    loginPage.login(users.standard.username, users.standard.password);
    inventoryPage.assertIsOpen(inventoryPage.title);
  });

  it('allows a standard user to purchase products: Login -> Add to Cart -> Checkout -> Confirmation', () => {
    const { products, customer, confirmation } = checkoutData;
    const expectedPrices = [];

    // Step 1: Add to Cart
    products.forEach((productName, index) => {
      inventoryPage.getProductPrice(productName).then((price) => expectedPrices.push(price));
      inventoryPage.addProductToCart(productName);
      inventoryPage.getRemoveButton(productName).should('be.visible');
      inventoryPage.getCartBadge().should('have.text', String(index + 1));
    });

    // Step 2: Review the cart
    inventoryPage.openCart();
    cartPage.assertIsOpen(cartPage.title);
    cartPage.getCartItems().should('have.length', products.length);
    products.forEach((productName) => {
      cartPage.getCartItemNames().should('contain.text', productName);
    });

    // Step 3: Checkout - customer information
    cartPage.proceedToCheckout();
    checkoutInformationPage.assertIsOpen(checkoutInformationPage.title);
    checkoutInformationPage.fillCustomerInformation(customer).continue();

    // Step 4: Checkout - overview and price validation
    checkoutOverviewPage.assertIsOpen(checkoutOverviewPage.title);
    checkoutOverviewPage.getItemNames().should('have.length', products.length);

    checkoutOverviewPage.getSubtotal().then((subtotal) => {
      const expectedSubtotal = Cypress._.sum(expectedPrices);
      expect(subtotal, 'item subtotal').to.be.closeTo(expectedSubtotal, 0.001);

      checkoutOverviewPage.getTax().then((tax) => {
        checkoutOverviewPage.getTotal().then((total) => {
          expect(total, 'order total').to.be.closeTo(subtotal + tax, 0.001);
        });
      });
    });

    // Step 5: Confirmation
    checkoutOverviewPage.finish();
    checkoutCompletePage.assertIsOpen(checkoutCompletePage.title);
    checkoutCompletePage.getConfirmationHeader().should('have.text', confirmation.header);
    checkoutCompletePage.getConfirmationText().should('have.text', confirmation.text);
    checkoutCompletePage.getCartBadge().should('not.exist');
  });
});
