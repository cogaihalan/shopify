customElements.define(
  'push-cart-item',
  class PushCartItem extends window.BAO.CustomElement() {
    _loading = false
    sections = window.BAO.utils.sectionRenderer.pushCartSections

    setupListeners () {
      super.setupListeners()

      this.removeLineItem = this.removeLineItem.bind(this)
      this.changeLineItem = this.changeLineItem.bind(this)
      this.updateQuantity = this.updateQuantity.bind(this)

      if (this.els.remove?.exists) {
        this.listeners.add(
          this.els.remove.element,
          'click',
          this.removeLineItem,
        )
      }

      if (this.els.variant?.exists) {
        this.listeners.add(
          this.els.variant.element,
          'change',
          this.changeLineItem,
        )
      }

      if (this.els.quantity?.exists) {
        this.els.quantity.elements.forEach(quantityEl => {
          this.listeners.add(quantityEl, 'change', this.updateQuantity)
        })
      }
    }

    async removeLineItem () {
      this.setAttribute('aria-busy', 'true')
      const state = this.hasPairedItem
        ? await window.BAO.Cart.removeItems(
          [this.key, this.pairedKey],
          this.sections.map(s => s.section),
        )
        : await window.BAO.Cart.removeItem(
          this.key,
          this.sections.map(s => s.section),
        )

      if ('sections' in state) this.renderSections(state.sections)
    }

    async changeLineItem (event) {
      const id = event.target.value
      this.setAttribute('aria-busy', 'true')
      await window.BAO.Cart.addItem({ id }, null, {
        sections: ['push-cart-count'],
      })
      await this.removeLineItem()
    }

    async updateQuantity (e) {
      const state = await window.BAO.Cart.updateQuantity(
        this.key,
        parseInt(e.target.value, 10),
        this.sections.map(s => s.section),
      )

      if ('sections' in state) this.renderSections(state.sections)
    }

    get loading () {
      return this._loading
    }

    set loading (val) {
      this._loading = val
    }

    get key () {
      return this.getAttribute('key')
    }

    get pairedKey () {
      return this.getAttribute('paired-key')
    }

    get hasPairedItem () {
      return !!this.pairedKey
    }
  },
)
