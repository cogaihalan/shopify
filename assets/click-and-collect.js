if (!customElements.get('click-and-collect')) {
  customElements.define(
    'click-and-collect',
    class ClickAndCollect extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        this.onAfterCartAdd = this.onAfterCartAdd.bind(this)

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.AFTER_ADD,
          this.onAfterCartAdd,
        )
      }

      disconnectedCallback () {
        super.disconnectedCallback()

        window.BAO.eventBus.removeEventListener(
          window.BAO.EVENTS.PUSH_CART.AFTER_ADD,
          this.onBeforeCartAdd,
        )
      }

      async onAfterCartAdd () {
        const cart = await fetch('/cart.js').then(response => {
          if (!response.ok) {
            throw response
          }

          return response.json()
        })

        if (cart && cart.items && cart.attributes.externalId) {
          for (const item in cart.items) {
            await fetch('/cart/change.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: cart.items[item].key,
                properties: {
                  _storeId: cart.attributes.externalId,
                },
              }),
            })
          }
        }
      }
    },
  )
}
