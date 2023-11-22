if (!customElements.get('order-protection-widget')) {
  customElements.define(
    'order-protection-widget',
    class OrderProtectionWidget extends window.BAO.CustomElement() {
      constructor () {
        super()

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.CHANGED,
          window.orderProtection.init(),
        )
      }
    },
  )
}
