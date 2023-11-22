if (!customElements.get('track-order-form')) {
  customElements.define(
    'track-order-form',
    // eslint-disable-next-line no-undef
    class TrackOrderForm extends window.BAO.CustomElement() {
      _requiredElements = ['form', 'order', 'submit']

      connectedCallback () {
        super.connectedCallback()
        this.checkRequirements()
        this.initialize()
      }

      checkRequirements () {
        this.checkRequiredElements()
      }

      checkRequiredElements () {
        this._requiredElements.forEach(requiredElementKey => {
          if (!this.hasEl(requiredElementKey)) {
            throw new Error(
              `${this.identifier} requires a child element called '${requiredElementKey}'. data-${this.identifier}-el="${requiredElementKey}" is missing`,
            )
          }
        })
      }

      initialize () {
        this.setupListeners()
      }

      setupListeners () {
        if (this.els?.submit?.exists) {
          this.handleClick = this.handleClick.bind(this)

          this.listeners.add(this.els.submit.element, 'click', this.handleClick)
        }

        const accTrackOrderBtns = document.querySelectorAll(
          '.acc-Order_Button[data-modal-trigger]',
        )

        if (accTrackOrderBtns) {
          this.setFormOrderField = this.setFormOrderField.bind(this)

          accTrackOrderBtns.forEach(btn => {
            this.listeners.add(btn, 'click', this.setFormOrderField)
          })
        }
      }

      setFormOrderField (e) {
        if (!e.target.dataset.orderNumber) return

        this.els.order.element.value = e.target.dataset.orderNumber
      }

      hasEl (key) {
        return !!(this.els[key] && this.els[key].element)
      }

      getEl (key) {
        return this.els[key].element
      }

      handleClick () {
        if (!this.els?.order?.exists) return

        const customerOrderNumber = this.processOrderNumber()

        this.els.order.element.value = customerOrderNumber

        this.handleSubmit()
      }

      processOrderNumber () {
        return this.els.order.element.value.replace(/[^0-9]+/g, '')
      }

      handleSubmit () {
        if (!this.els?.form?.exists) return

        if (this.els.order.element.value.length === 0) {
          return
        }

        this.els.form.element.submit()
      }
    },
  )
}
