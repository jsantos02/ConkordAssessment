import BasePage from './BasePage';

class InventoryPage extends BasePage {
  path = '/inventory.html';
  title = 'Products';

  selectors = {
    inventoryItem: 'inventory-item',
    itemName: 'inventory-item-name',
    itemPrice: 'inventory-item-price',
    addToCartButtonPrefix: 'add-to-cart',
    removeButtonPrefix: 'remove',
  };

  /** Returns the product card whose visible name matches `productName`. */
  getProductCard(productName) {
    return cy
      .contains(
        `[data-test="${this.selectors.itemName}"]`,
        new RegExp(`^${Cypress._.escapeRegExp(productName)}$`),
      )
      .parents(`[data-test="${this.selectors.inventoryItem}"]`);
  }

  addProductToCart(productName) {
    this.getProductCard(productName)
      .find(`[data-test^="${this.selectors.addToCartButtonPrefix}"]`)
      .click();
    return this;
  }

  /** Yields the numeric price of a product as displayed on its card. */
  getProductPrice(productName) {
    return this.getProductCard(productName)
      .find(`[data-test="${this.selectors.itemPrice}"]`)
      .invoke('text')
      .then((text) => parseFloat(text.replace('$', '')));
  }

  getRemoveButton(productName) {
    return this.getProductCard(productName).find(
      `[data-test^="${this.selectors.removeButtonPrefix}"]`,
    );
  }
}

export default new InventoryPage();
