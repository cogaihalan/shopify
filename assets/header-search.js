if (!customElements.get('header-search')) {
  customElements.define(
    'header-search',
    // eslint-disable-next-line no-undef
    class HeaderSearch extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        if (this.hasExternalEl('trigger')) {
          this.externalEls.trigger.elements.forEach(trigger => {
            this.listeners.add(trigger, 'click', this.handleTrigger.bind(this))
          })
        }

        if (this.dataset.searchContext === 'mobile-menu') {
          this.listeners.add(this, 'click', this.handleMenuTrigger.bind(this))
          this.listeners.add(this, 'focus', this.handleMenuTrigger.bind(this))
        }

        this.listeners.add(document.body, 'click', this.handleClose.bind(this))

        this.listeners.add(document.body, 'focus', this.handleClose.bind(this))

        this.listeners.add(document, 'keyup', this.handleEscape.bind(this))
      }

      handleTrigger (event) {
        const trigger = event.target.closest(this.externalEls.trigger.selector)
        if (
          !trigger ||
          document
            .querySelector('body')
            .classList.contains('util-DrawersOpen') ||
          this.dataset.searchContext !== 'header'
        ) {
          return
        }

        this.isActive = this.getAttribute('aria-hidden') === 'true'
      }

      handleMenuTrigger (event) {
        if (
          (this.closest('.drw-Drawer-menu') && this.isActive) ||
          this.dataset.searchContext !== 'mobile-menu'
        ) {
          return
        }

        this.isActive = this.getAttribute('aria-hidden') === 'true'
      }

      handleClose (event) {
        const headerSearch = event.target.closest(this.tagName)
        const trigger = event.target.closest(this.externalEls.trigger.selector)
        const algoliaDropdown = event.target.closest('.aa-Panel')

        const closeAlgoliaButton = event.target.closest('.aa-Close')
        const algoliaBackdrop = event.target.closest('.aa-PanelBackdrop')

        const drawerSearch = event.target.closest(
          '.drw-Drawer-menu .hd-Banner_Search',
        )
        const drawersOpen = document
          .querySelector('body')
          .classList.contains('util-DrawersOpen')

        if (
          (headerSearch || trigger || algoliaDropdown) &&
          !closeAlgoliaButton &&
          !algoliaBackdrop
        ) {
          return
        }

        if (drawerSearch && drawersOpen) {
          return
        }

        this.isActive = false
      }

      handleEscape (event) {
        if (event.key === 'Escape') {
          this.isActive = false
        }
      }

      hasEl (elementName) {
        return this.els[elementName] && this.els[elementName].exists
      }

      hasExternalEl (elementName) {
        return (
          this.externalEls[elementName] && this.externalEls[elementName].exists
        )
      }

      set isActive (boolean) {
        this._isActive = boolean
        this.setAttribute('aria-hidden', (!boolean).toString())
        document.body.dataset.searchActive = boolean.toString()

        if (boolean === true) {
          if (this.els?.input?.element) this.els.input.element.focus()

          setTimeout(() => {
            if (this.querySelector('.aa-Input')) {
              this.querySelector('.aa-Input').focus()
            }
          }, 100)
        }
      }

      get isActive () {
        return this._isActive
      }
    },
  )
}
