class ModalElement extends HTMLElement {
  constructor () {
    super()

    this.triggerEls = document.querySelectorAll('[data-modal-trigger]')
    this.closeEls = this.querySelectorAll('[data-el="modal-element.close"]')

    document.addEventListener(
      'keyup',
      event => event.code.toUpperCase() === 'ESCAPE' && this.close(),
    )

    this.triggerEls.forEach(triggerEl =>
      triggerEl.addEventListener('click', this.open.bind(this)),
    )

    this.closeEls.forEach(closeEl =>
      closeEl.addEventListener('click', this.close.bind(this)),
    )
  }

  open (event) {
    if (event.currentTarget.dataset.modalTrigger === this.dataset.modal) {
      this.setAttribute('aria-hidden', 'false')
    }
  }

  close () {
    this.setAttribute('aria-hidden', 'true')
  }
}

customElements.define('modal-element', ModalElement)
