class ModalMobileElement extends HTMLElement {
  constructor () {
    super()

    this.closeEls = this.querySelectorAll(
      '[data-el="modal-mobile-element.close"]',
    )

    document.addEventListener(
      'keyup',
      event => event.code.toUpperCase() === 'ESCAPE' && this.close(),
    )

    this.closeEls.forEach(closeEl =>
      closeEl.addEventListener('click', this.close.bind(this)),
    )
  }

  close () {
    this.setAttribute('aria-hidden', 'true')
  }
}

customElements.define('modal-mobile-element', ModalMobileElement)
