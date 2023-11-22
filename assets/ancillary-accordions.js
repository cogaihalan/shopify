if (!customElements.get('ancillary-accordions')) {
  customElements.define(
    'ancillary-accordions',
    class AncillaryAccordions extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        if (
          this.els.items &&
          this.els.items.exists &&
          this.els.trigger &&
          this.els.trigger.exists
        ) {
          this.handleTrigger = this.handleTrigger.bind(this)
          this.listeners.add(
            this.els.items.element,
            'click',
            this.handleTrigger,
          )
        }

        if (this.els.search && this.els.search.exists) {
          this.handleInput = this.handleInput.bind(this)
          this.listeners.add(this.els.search.element, 'input', this.handleInput)
        }
      }

      handleTrigger (event) {
        const trigger = event.target.closest(this.els.trigger.selector)
        if (!trigger) return

        const accordionIndex = parseInt(trigger.dataset.index, 10)

        const currentItemElement = this.els.item.elements[accordionIndex]

        currentItemElement.style.setProperty(
          '--Max_Height',
          `${this.els.content.elements[accordionIndex].offsetHeight}px`,
        )
        currentItemElement.setAttribute(
          'aria-expanded',
          currentItemElement.getAttribute('aria-expanded') !== 'true',
        )
      }

      handleInput (event) {
        const value = event.target.value

        if (value.length < 4) {
          this.els.item.elements.forEach(item =>
            item.setAttribute('aria-hidden', 'false'),
          )
        }

        if (value.length < 4 || !this.els.item || !this.els.item.exists) return
        this.els.item.elements.forEach(item =>
          item.setAttribute(
            'aria-hidden',
            (!item.textContent
              .toLowerCase()
              .includes(value.toLowerCase())).toString(),
          ),
        )
      }
    },
  )
}
