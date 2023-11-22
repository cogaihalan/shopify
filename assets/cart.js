if (!customElements.get('cart-page')) {
  customElements.define(
    'cart-page',
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
            `<cart-drawer> needs to be used within a <site-drawer> element`
          )
        }
      }

      setupListeners () {
        super.setupListeners()

        this.onBeforeCartAdd = this.onBeforeCartAdd.bind(this)
        this.onAfterCartAdd = this.onAfterCartAdd.bind(this)

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.BEFORE_ADD,
          this.onBeforeCartAdd
        )

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.AFTER_ADD,
          this.onAfterCartAdd
        )
      }

      disconnectedCallback () {
        super.disconnectedCallback()

        window.BAO.eventBus.removeEventListener(
          window.BAO.EVENTS.PUSH_CART.BEFORE_ADD,
          this.onBeforeCartAdd
        )

        window.BAO.eventBus.removeEventListener(
          window.BAO.EVENTS.PUSH_CART.AFTER_ADD,
          this.onBeforeCartAdd
        )
      }

      onBeforeCartAdd () {
        this.drawers.activeDrawerKey = this.drawer.getAttribute('key')
      }

      onAfterCartAdd (event) {
        if ('sections' in event.detail.state)
          this.renderSections(event.detail.state.sections)
      }

      get drawers () {
        return this.closest('site-drawers')
      }

      get drawer () {
        return this.closest('site-drawer')
      }
    }
  )
}
