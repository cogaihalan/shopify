customElements.define(
  'push-cart',
  class PushCart extends window.BAO.CustomElement() {
    _loading = false
    get loading () {
      return this._loading
    }

    set loading (val) {
      this._loading = val
    }

    sections = window.BAO.utils.sectionRenderer.pushCartSections

    constructor () {
      super()

      if (this.drawer == null) {
        throw new Error(
          '<cart-drawer> needs to be used within a <site-drawer> element',
        )
      }
    }

    setupListeners () {
      super.setupListeners()

      this.onBeforeCartAdd = this.onBeforeCartAdd.bind(this)
      this.onAfterCartAdd = this.onAfterCartAdd.bind(this)
      this.onAfterRemove = this.onAfterRemove.bind(this)
      this.OnAfterUpdateQuantity = this.OnAfterUpdateQuantity.bind(this)

      window.BAO.eventBus.addEventListener(
        window.BAO.EVENTS.PUSH_CART.BEFORE_ADD,
        this.onBeforeCartAdd,
      )
      window.BAO.eventBus.addEventListener(
        window.BAO.EVENTS.PUSH_CART.BEFORE_MULTIPLE_ADD,
        this.onBeforeCartAdd,
      )

      window.BAO.eventBus.addEventListener(
        window.BAO.EVENTS.PUSH_CART.AFTER_ADD,
        this.onAfterCartAdd,
      )
      window.BAO.eventBus.addEventListener(
        window.BAO.EVENTS.PUSH_CART.AFTER_MULTIPLE_ADD,
        this.onAfterCartAdd,
      )

      window.BAO.eventBus.addEventListener(
        window.BAO.EVENTS.PUSH_CART.AFTER_UPDATE_REMOVE_ITEM,
        this.onAfterRemove,
      )

      window.BAO.eventBus.addEventListener(
        window.BAO.EVENTS.PUSH_CART.AFTER_UPDATE_ITEM_QUANTITY,
        this.OnAfterUpdateQuantity,
      )
    }

    disconnectedCallback () {
      super.disconnectedCallback()

      window.BAO.eventBus.removeEventListener(
        window.BAO.EVENTS.PUSH_CART.BEFORE_ADD,
        this.onBeforeCartAdd,
      )

      window.BAO.eventBus.removeEventListener(
        window.BAO.EVENTS.PUSH_CART.AFTER_ADD,
        this.onBeforeCartAdd,
      )
    }

    onBeforeCartAdd () {
      this.drawers.activeDrawerKey = this.drawer.getAttribute('key')
    }

    onAfterCartAdd (event) {
      if ('sections' in event.detail.state) {
        this.renderSections(event.detail.state.sections)
      }
      this.checkIfGiftWrappingShouldBeRemoved()
    }

    async checkIfGiftWrappingShouldBeRemoved () {
      const cartItemsTotal = Number(
        this.querySelector('#push-cart-items').dataset.cartTotal,
      )
      const isGiftWrappingInTheCart = this.querySelector(
        'push-cart-item[data-is-gift-wrapping]',
      )
      const isAGiftCardInTheCart = this.querySelectorAll(
        'push-cart-item[data-is-gift-card]',
      )
      if (!isGiftWrappingInTheCart) return

      const cartTotalNotIncludingGiftWrap = cartItemsTotal - 1

      if (cartTotalNotIncludingGiftWrap === 0 && isGiftWrappingInTheCart) {
        await this.removeItemFromCart(
          this.querySelector('push-cart-item[data-is-gift-wrapping]').key,
        )
        return true
      }

      if (cartTotalNotIncludingGiftWrap > window.BAO.giftWrapping) {
        await this.removeItemFromCart(
          this.querySelector('push-cart-item[data-is-gift-wrapping]').key,
        )
        return true
      }

      if (isAGiftCardInTheCart.length === cartTotalNotIncludingGiftWrap) {
        await this.removeItemFromCart(
          this.querySelector('push-cart-item[data-is-gift-wrapping]').key,
        )
        return true
      }
    }

    async OnAfterUpdateQuantity (event) {
      if ('sections' in event.detail.state) {
        this.renderSections(event.detail.state.sections)
      }
      this.checkIfGiftWrappingShouldBeRemoved()
    }

    async onAfterRemove (event) {
      if ('sections' in event.detail.state) {
        this.renderSections(event.detail.state.sections)
      }
      this.checkIfGiftWrappingShouldBeRemoved()
    }

    async removeItemFromCart (key) {
      try {
        return window.BAO.Cart.removeItem(
          key,
          window.BAO.utils.sectionRenderer.pushCartSections.map(s => s.section),
        )
      } catch (err) {
        // eslint-disable-next-line no-undef
        return this.handleAddToCartError(err, item)
      }
    }

    get drawers () {
      return this.closest('site-drawers')
    }

    get drawer () {
      return this.closest('site-drawer')
    }
  },
)
