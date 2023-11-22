window.BAO.EVENTS = {
  PUSH_CART: {
    BEFORE_ADD: 'BEFORE_ADD',
    AFTER_ADD: 'AFTER_ADD',
    BEFORE_MULTIPLE_ADD: 'BEFORE_MULTIPLE_ADD',
    AFTER_MULTIPLE_ADD: 'AFTER_MULTIPLE_ADD',
    BEFORE_UPDATE_REMOVE_ITEM: 'BEFORE_UPDATE_REMOVE_ITEM',
    AFTER_UPDATE_REMOVE_ITEM: 'AFTER_UPDATE_REMOVE_ITEM',
    BEFORE_UPDATE_ITEM_QUANTITY: 'BEFORE_UPDATE_ITEM_QUANTITY',
    AFTER_UPDATE_ITEM_QUANTITY: 'AFTER_UPDATE_ITEM_QUANTITY',
    BEFORE_UPDATE_CART_ATTRIBUTES: 'BEFORE_UPDATE_CART_ATTRIBUTES',
    AFTER_UPDATE_CART_ATTRIBUTES: 'AFTER_UPDATE_CART_ATTRIBUTES',
    CHANGED: 'CHANGED',
  },
  COLLECTION: {
    LAYOUT_CHANGED: 'LAYOUT_CHANGED',
  },
  PRODUCT: {
    VARIANT_CHANGED: 'VARIANT_CHANGED',
  },
  QUICKBUY: {
    BEFORE_OPTIONS_LOAD: 'BEFORE_OPTIONS_LOAD',
    AFTER_OPTIONS_LOAD: 'AFTER_OPTIONS_LOAD',
  },
  WISHLIST: {
    UPDATED: 'WISHLIST_UPDATED',
  },
}

class EventBus {
  bus = document.createElement('div')

  addEventListener (event, callback) {
    this.bus.addEventListener(event, callback)
  }

  removeEventListener (event, callback) {
    this.bus.removeEventListener(event, callback)
  }

  dispatchEvent (event, detail = {}) {
    this.bus.dispatchEvent(new CustomEvent(event, { detail }))
  }
}

window.BAO.eventBus = new EventBus()
window.BAO.dispatchEvent = window.BAO.eventBus.dispatchEvent.bind(
  window.BAO.eventBus,
)
