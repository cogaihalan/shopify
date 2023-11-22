if (!customElements.get('product-options')) {
  customElements.define(
    'product-options',
    // eslint-disable-next-line no-undef
    class ProductOptions extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        if (!this.els.trigger || this.els.trigger.elements.length < 2) return

        this.handleTrigger = this.handleTrigger.bind(this)

        this.listeners.add(this, 'click', this.handleTrigger)
      }

      handleTrigger (event) {
        const trigger = event.target.closest(
          '[data-product-options-el="trigger"]',
        )
        if (!trigger) return

        const optionIndex = trigger.dataset.index
        const optionValue = trigger.dataset.value

        const allIndexTriggerEls = [
          ...document.querySelectorAll(
            `${this.els.trigger.selector}[data-index="${optionIndex}"]`,
          ),
        ]

        allIndexTriggerEls
          .filter(
            triggerEl => this.isQuickBuy(trigger) === this.isQuickBuy(triggerEl),
          )
          .forEach(triggerEl => {
            triggerEl.setAttribute(
              'aria-pressed',
              (triggerEl.dataset.value === optionValue).toString(),
            )
          })

        const allIndexSelectEls = [
          ...document.querySelectorAll(
            `${this.els.select.selector}[data-index="${optionIndex}"]`,
          ),
        ]

        allIndexSelectEls
          .filter(
            selectEl => this.isQuickBuy(trigger) === this.isQuickBuy(selectEl),
          )
          .forEach(selectEl => {
            selectEl.value = optionValue
            selectEl.dispatchEvent(new Event('change', { bubbles: true }))
          })
      }

      isQuickBuy (element) {
        return !!element.closest('[data-section="product-quickbuy"]')
      }
    },
  )
}
