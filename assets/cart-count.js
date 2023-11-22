if (!customElements.get('cart-count')) {
  customElements.define(
    'cart-count',
    class CartCount extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.CHANGED,
          this.onCartChanged.bind(this),
        )
      }

      onCartChanged (e) {
        const { state } = e.detail
        if (!state) return

        if (!('push-cart-count' in state?.sections)) return

        const count = this.getCount(state.sections['push-cart-count'])

        this.textContent = count
        this.setAttribute('data-count', count)
        this.setAttribute('aria-hidden', count === '0')
      }

      getCount (html) {
        const DOM = window.BAO.utils.sectionRenderer.convertToDOM(html)

        return DOM.querySelector('#push-cart-count').textContent
      }
    },
  )
}
