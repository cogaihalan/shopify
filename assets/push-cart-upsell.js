if (!customElements.get('push-cart-upsell')) {
  customElements.define(
    'push-cart-upsell',
    class PushCartUpsell extends window.BAO.CustomElement() {
      connectedCallback () {
        super.connectedCallback()

        this.form = this.querySelector('form')

        fetch(this.url)
          .then(res => res.text())
          .then(text => this.handleFetchResponse(text))
          .catch(e => console.error(e))
      }

      setupListeners () {
        this.beforeAddToCartAdd = this.beforeAddToCartAdd.bind(this)

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.BEFORE_ADD,
          this.beforeAddToCartAdd,
        )
      }

      beforeAddToCartAdd (e) {
        e.detail.attributes.hide_upsell = true
      }

      handleFetchResponse (text) {
        const div = document.createElement('div')
        div.innerHTML = text
        const section = div.querySelector(
          '[data-section-type="push-cart-upsell"]',
        )

        if (section && section.innerHTML.trim().length > 0) {
          this.innerHTML = section.innerHTML
          this.form = this.querySelector('form')
        }
      }

      get url () {
        return this.getAttribute('url')
      }
    },
  )
}
