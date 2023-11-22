if (!customElements.get('cart-item')) {
  customElements.define(
    'cart-item',
    // eslint-disable-next-line no-undef
    class CartItem extends window.BAO.CustomElement() {
      requiredEls = ['remove', 'quantity']
      requiredExternalEls = ['cart']

      sections = window.BAO.utils.sectionRenderer.cartSections

      constructor () {
        super()
        this.initialize()
      }

      initialize () {
        this.checkRequirements()
      }

      setupListeners () {
        super.setupListeners()

        if (this.hasEl('remove')) {
          this.listeners.add(this, 'click', this.onRemoveClick.bind(this))
        }

        if (this.hasEl('quantity')) {
          this.listeners.add(
            this.els.quantity.element,
            'change',
            this.onQuantityChange.bind(this),
          )
        }

        if (this.hasEl('variant')) {
          this.listeners.add(
            this.els.variant.element,
            'change',
            this.changeLineItem.bind(this),
          )
        }
      }

      async onRemoveClick (event) {
        if (event.target.closest(this.els.remove.selector) == null) return
        this.setAttribute('aria-busy', 'true')
        await this.render(await this.removeItem())
        this.setAttribute('aria-busy', 'false')
      }

      async onQuantityChange () {
        this.setAttribute('aria-busy', 'true')
        await this.render(await this.updateQuantity())
        this.setAttribute('aria-busy', 'false')
      }

      async render (state) {
        if (state.item_count === 0) return window.location.reload()

        if ('sections' in state) this.renderSections(state.sections)
      }

      async removeItem () {
        this.setAttribute('aria-busy', 'true')

        const state = this.hasPairedItem
          ? await window.BAO.Cart.removeItems(
            [this.lineItemKey, this.pairedKey],
            window.BAO.utils.sectionRenderer.cartSections.map(s => s.section),
          )
          : await window.BAO.Cart.removeItem(
            this.lineItemKey,
            window.BAO.utils.sectionRenderer.cartSections.map(s => s.section),
          )

        if ('sections' in state) this.renderSections(state.sections)

        return state
      }

      async updateQuantity () {
        return await window.BAO.Cart.updateQuantity(
          this.lineItemKey,
          this.quantity,
          window.BAO.utils.sectionRenderer.cartSections.map(s => s.section),
        )
      }

      async changeLineItem (event) {
        const id = event.target.value
        this.setAttribute('aria-busy', 'true')
        await window.BAO.Cart.addItem({ id }, null, {
          sections: ['push-cart-count'],
        })
        await this.removeItem()
      }

      checkRequirements () {
        this.checkRequiredEls()
        this.checkRequiredExternalEls()
      }

      checkRequiredEls () {
        this.requiredEls.forEach(requiredEl => {
          if (!this.hasEl(requiredEl)) {
            this.raiseError(
              `${requiredEl} is required: data-${this.identifier}-el="${requiredEl}"`,
            )
          }
        })
      }

      checkRequiredExternalEls () {
        this.requiredExternalEls.forEach(requiredExternalEl => {
          if (!this.hasExternalEl(requiredExternalEl)) {
            this.raiseError(
              `${requiredExternalEl} is required: data-${this.identifier}-external-el="${requiredExternalEl}"`,
            )
          }
        })
      }

      hasEl (elementName) {
        return this.els[elementName] && this.els[elementName].exists
      }

      hasExternalEl (elementName) {
        return (
          this.externalEls[elementName] && this.externalEls[elementName].exists
        )
      }

      get cartEl () {
        return this.hasExternalEl('cart')
          ? this.externalEls.cart.element
          : document
      }

      get lineItemKey () {
        return this.dataset.key
      }

      get quantity () {
        return this.els.quantity
          ? parseInt(this.els.quantity.element.value, 10)
          : 1
      }

      get pairedKey () {
        return this.getAttribute('paired-key')
      }

      get hasPairedItem () {
        return !!this.pairedKey
      }
    },
  )
}
