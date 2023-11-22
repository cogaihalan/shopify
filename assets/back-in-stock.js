if (!customElements.get('back-in-stock')) {
  customElements.define(
    'back-in-stock',
    // eslint-disable-next-line no-undef
    class BackInStock extends window.BAO.CustomElement() {
      constructor () {
        super()

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.QUICKBUY.AFTER_OPTIONS_LOAD,
          () => {
            const triggerEls = window.BAO.utils.getElements(
              this.triggerSelector,
            )
            this.externalEls = this.externalEls || {}
            this.externalEls.trigger = {
              exists: triggerEls.length > 0,
              elements: triggerEls,
              element: triggerEls[0],
              selector: this.triggerSelector,
            }

            this.disconnectedCallback()
            this.setupListeners()
          },
        )
      }

      setupListeners () {
        super.setupListeners()

        if (this.hasExternalEl('trigger')) {
          this.getExternalEls('trigger').forEach(triggerEl => {
            this.listeners.add(
              triggerEl,
              'click',
              this.handleTriggerClick.bind(this),
            )
          })
        }

        if (!this.hasEl('form')) return
        this.listeners.add(
          this.getEl('form'),
          'submit',
          this.handleSubmit.bind(this),
        )
      }

      handleTriggerClick (event) {
        const triggerEl = event.target.closest(
          this.externalEls.trigger.selector,
        )
        if (!triggerEl) return

        this.productId = triggerEl.dataset.productId || null
        this.variantId = triggerEl.dataset.variantId || null
      }

      async handleSubmit (event) {
        event.preventDefault()
        if (this.email.length < 1) return
        const BISResponse = await this.sendBIS()
        this.handleResponse(BISResponse)
        return false
      }

      async sendBIS () {
        // eslint-disable-next-line no-undef
        return BIS.create(this.email, this.variantId, this.productId)
      }

      handleResponse (response) {
        const responseEl = this.getEl('response')
        const { errors = null, message = null } = response
        const errorArray = errors
          ? Object.keys(errors).map(key => errors[key])
          : []

        if (!responseEl) return
        this.toggleResponse(false)

        responseEl.innerHTML = ''
        responseEl.dataset.status = response.status.toLowerCase()
        responseEl.innerHTML = message
          ? `<p>${message}</p>`
          : responseEl.innerHTML

        errorArray.forEach(error => {
          responseEl.innerHTML += `<p>${error}</p>`
        })

        this.toggleResponse(true)
      }

      toggleResponse (isVisible) {
        this.getEl('response').setAttribute(
          'aria-hidden',
          (!isVisible).toString(),
        )
      }

      hasEl (elementName) {
        return this.els[elementName] && this.els[elementName].exists
      }

      hasExternalEl (elementName) {
        return (
          this.externalEls[elementName] && this.externalEls[elementName].exists
        )
      }

      getEl (elementName) {
        return this.hasEl(elementName) ? this.els[elementName].element : null
      }

      getExternalEl (elementName) {
        return this.hasExternalEl(elementName)
          ? this.externalEls[elementName].element
          : null
      }

      getEls (elementName) {
        return this.hasEl(elementName) ? this.els[elementName].elements : []
      }

      getExternalEls (elementName) {
        return this.hasExternalEl(elementName)
          ? this.externalEls[elementName].elements
          : []
      }

      get email () {
        const emailEl = this.getEl('email')
        return emailEl ? emailEl.value : ''
      }

      get productId () {
        return this._productId
      }

      set productId (productId) {
        this._productId = productId
      }

      get variantId () {
        return this._variantId
      }

      set variantId (variantId) {
        this._variantId = variantId
      }

      get triggerSelector () {
        return '[data-back-in-stock-external-el="trigger"]'
      }
    },
  )
}
