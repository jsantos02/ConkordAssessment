import BasePage from './BasePage';

class CartPage extends BasePage {
  path = '/cart.html';
  title = 'Your Cart';

  selectors = {
    cartItem: 'inventory-item',
    itemName: 'inventory-item-name',
    checkoutButton: 'checkout',
  };

  getCartItems() {
    return cy.getByTestId(this.selectors.cartItem);
  }

  getCartItemNames() {
    return cy.getByTestId(this.selectors.itemName);
  }

  proceedToCheckout() {
    cy.getByTestId(this.selectors.checkoutButton).click();
  }
}

export default new CartPage();
