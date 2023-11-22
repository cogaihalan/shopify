if (!customElements.get('product-messaging')) {
  customElements.define(
    'product-messaging',
    // eslint-disable-next-line no-undef
    class ProductMessaging extends window.BAO.CustomElement() {
      constructor () {
        super()

        this.innerHTML =
          this.innerHTML + this.innerHTML + this.innerHTML + this.innerHTML
      }
    },
  )
}
