if (!customElements.get('bundle-upsell')) {
  customElements.define(
    'bundle-upsell',
    // eslint-disable-next-line no-undef
    class BundleUpsell extends window.BAO.CustomElement() {
      requiredEls = ['content', 'items', 'submit', 'mobileDrawer', 'close']

      constructor () {
        super()

        this.mobileDrawer = this.els.mobileDrawer.element
        this.closedUpsellModal = false
      }

      setupListeners () {
        super.setupListeners()

        // if (!this.hasEl('submit')) return

        this.onAfterCartAdd = this.onAfterCartAdd.bind(this)
        this.onBeforeCartAdd = this.onBeforeCartAdd.bind(this)
        this.onAfterRemove = this.onAfterRemove.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.BEFORE_ADD,
          this.onBeforeCartAdd,
        )

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.AFTER_ADD,
          this.onAfterCartAdd,
        )

        window.BAO.eventBus.addEventListener(
          window.BAO.EVENTS.PUSH_CART.AFTER_UPDATE_REMOVE_ITEM,
          this.onAfterRemove,
        )

        if (this.hasEl('submit')) {
          this.els.submit.elements.forEach(submitEl => {
            this.listeners.add(submitEl, 'click', this.onSubmit)
          })
        }

        if (this.hasEl('mobileDrawer')) {
          this.listeners.add(
            this.mobileDrawer,
            'click',
            this.handleCloseMobileDrawer.bind(this),
          )
        }
      }

      onSubmit (event) {
        if (window.innerWidth > 768) {
          window.localStorage.setItem(this.storageName, 'true')
        } else {
          const mobileDrawerIsOpen =
            this.mobileDrawer.getAttribute('aria-expanded') === 'true'

          if (mobileDrawerIsOpen) return
          event.preventDefault()
          this.renderMobileDrawer(event)
        }
      }

      async onAfterRemove () {
        const html = await this.fetchSectionHTML()

        this.renderBundleUpsell(html)
      }

      async onBeforeCartAdd (event) {
        const hasItemParent = event.detail.form.closest(
          '[data-bundle-upsell-item]',
        )
        const isMainForm = event.detail.form.hasAttribute(
          'data-main-product-form',
        )

        if (hasItemParent) {
          // Pause the cart event sequence temporarily.
          event.stopImmediatePropagation()
        }

        // If event came from the bundle upsell and no upsell has been added, trigger modal.
        if (isMainForm && !this.upsellAddedToCart && !this.closedUpsellModal) {
          const html = await this.fetchSectionHTML()
          const selector = `[data-modal-product-id="${this.productId}"]`
          const modal = document.querySelector(selector)

          await modal?.updateContent(html)
          modal?.open()
        }
      }

      async onAfterCartAdd (event) {
        const html = await this.fetchSectionHTML()

        this.renderBundleUpsell(html)
      }

      async fetchSectionHTML () {
        return await fetch(
          `/products/${this.productHandle}?section_id=${this.sectionId}`,
        )
          .then(response => response.text())
          .then(responseText => {
            const innerHTML = new DOMParser()
              .parseFromString(responseText, 'text/html')
              .querySelector('[data-bundle-upsell-el="content"]').innerHTML

            return innerHTML
          })
      }

      renderBundleUpsell (html) {
        if (this.hasEl('content')) {
          this.els.content.element.innerHTML = html
          const submitEls = this.els.content.element.querySelectorAll(
            '[data-bundle-upsell-el="submit"]',
          )

          submitEls.forEach(submitEl => {
            this.listeners.add(submitEl, 'click', this.onSubmit)
          })
        }

        const upsellModal = document.querySelector(
          'upsell-modal[aria-hidden="false"]',
        )

        if (!upsellModal) return
        const htmlHasUpsellItems = html.includes('class="bup-Item"')

        if (htmlHasUpsellItems) {
          upsellModal.querySelector(
            '[data-upsell-modal-el="content"]',
          ).innerHTML = html

          const modalSubmitEls = upsellModal.querySelectorAll(
            '[data-bundle-upsell-el="submit"]',
          )

          modalSubmitEls.forEach(submitEl => {
            this.listeners.add(submitEl, 'click', () => {
              window.localStorage.setItem(this.storageName, 'true')
            })
          })
        } else {
          upsellModal.close()
        }
      }

      renderMobileDrawer (event) {
        const mobileDrawerInner = this.mobileDrawer.querySelector(
          '.bup-MobileDrawer_Inner',
        )
        const mobileDrawerItem = this.mobileDrawer.querySelector('.bup-Item')

        if (mobileDrawerItem) {
          mobileDrawerInner.removeChild(mobileDrawerItem)
        }

        const bundleItemElClone = event.target
          .closest('.bup-Item')
          .cloneNode(true)
        mobileDrawerInner.insertAdjacentElement('beforeend', bundleItemElClone)
        this.mobileDrawer.setAttribute('aria-expanded', 'true')
      }

      handleCloseMobileDrawer (event) {
        const isBackground = event.target === this.mobileDrawer
        const isCloseEl = event.target.closest('.bup-MobileDrawer_Close')
        const isSubmitEl = event.target.closest(
          '[data-bundle-upsell-el="submit"]',
        )

        if (isBackground || isCloseEl || isSubmitEl) {
          this.mobileDrawer.setAttribute('aria-expanded', 'false')
        }

        if (isSubmitEl) {
          window.drawers.activeDrawerKey = 'cart'
        }
      }

      hasEl (elementName) {
        return this.els[elementName] && this.els[elementName].exists
      }

      disconnectedCallback () {
        super.disconnectedCallback()

        window.localStorage.removeItem(this.storageName)
      }

      get upsellAddedToCart () {
        return window.localStorage.getItem(this.storageName) === 'true'
      }

      get storageName () {
        return `BAO-upsell-used-${this.productId}`
      }

      get sectionId () {
        return 'bundle-upsell'
      }

      get productHandle () {
        return this.dataset.productHandle
      }

      get productId () {
        return this.dataset.productId
      }
    },
  )
}
