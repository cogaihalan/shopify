class ProductAccordions extends HTMLElement {
  constructor () {
    super()

    this.itemEls = this.querySelectorAll('[data-el="product-accordions.item"]')

    this.initialiseAccordions()
  }

  initialiseAccordions () {
    this.itemEls.forEach(itemEl => {
      const triggerEls = itemEl.querySelectorAll(
        '[data-el="product-accordions.trigger"]',
      )

      this.handleClick = this.handleClick.bind(this)

      triggerEls.forEach(triggerEl =>
        triggerEl.addEventListener('click', this.handleClick),
      )
    })
  }

  handleClick (event) {
    const currentState =
      event.target
        .closest('[data-el="product-accordions.item"]')
        .getAttribute('aria-expanded') === 'true'

    event.target
      .closest('[data-el="product-accordions.item"]')
      .setAttribute('aria-expanded', !currentState)
  }
}

customElements.define('product-accordions', ProductAccordions)
