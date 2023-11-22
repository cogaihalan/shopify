if (!customElements.get('push-cart-nosto')) {
  customElements.define(
    'push-cart-nosto',
    class PushCartUpsell extends window.BAO.CustomElement() {
      connectedCallback () {
        super.connectedCallback()
      }

      setupListeners () {
        this.afterPushCartChanged = this.afterPushCartChanged.bind(this)

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.CHANGED,
          this.afterPushCartChanged.bind(this),
        )
      }

      afterPushCartChanged (e) {
        // eslint-disable-next-line no-undef
        Nosto.reloadCart()

        const { state } = e.detail
        if (!state) return

        if (!('push-cart-count' in state?.sections)) return

        const DOM = window.BAO.utils.sectionRenderer.convertToDOM(
          state.sections['push-cart-count'],
        )

        const count = parseInt(
          DOM.querySelector('#push-cart-count').textContent,
        )

        this.setAttribute('aria-hidden', count === 0)
      }
    },
  )
}
