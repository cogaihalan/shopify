class FooterAccordions extends HTMLElement {
  constructor () {
    super()

    this.itemEls = this.querySelectorAll('[data-el="footer-accordions.item"]')

    this.initialiseAccordions()
  }

  initialiseAccordions () {
    this.itemEls.forEach(itemEl => {
      const triggerEl = itemEl.querySelector(
        '[data-el="footer-accordions.trigger"]',
      )

      this.handleClick = this.handleClick.bind(this)

      triggerEl.addEventListener('click', this.handleClick)
    })
  }

  handleClick (event) {
    const itemEl = event.target.closest('[data-el="footer-accordions.item"]')
    const linksEl = itemEl.querySelector('[data-el="footer-accordions.links"]')

    itemEl.style.setProperty('--Max_Height', `${linksEl.offsetHeight}px`)

    const currentState = itemEl.getAttribute('aria-expanded') === 'true'

    itemEl.setAttribute('aria-expanded', !currentState)
  }
}

customElements.define('footer-accordions', FooterAccordions)
