if (!customElements.get('upsell-modal')) {
  customElements.define(
    'upsell-modal',
    // eslint-disable-next-line no-undef
    class UpsellModal extends window.BAO.CustomElement() {
      requiredEls = ['content', 'close']

      constructor () {
        super()

        this.addedAnItem = false
        this.state = null
        this.item = null
        this.form = null
      }

      setupListeners () {
        super.setupListeners()

        this.open = this.open.bind(this)
        this.close = this.close.bind(this)

        document.addEventListener('keyup', event => {
          const keyCode = event?.code?.toUpperCase()
          if (keyCode === 'ESCAPE') {
            this.close()
          }
        })

        this.listeners.add(this, 'click', this.handleContextClick.bind(this))
      }

      attachListeners () {
        this.handleModalButtonClick = this.handleModalButtonClick.bind(this)

        // Remove form submit event
        const mainForm = this.els.content.element.querySelectorAll(
          'form[data-push-cart-form]',
        )

        mainForm.forEach(form => {
          form.replaceWith(form.cloneNode(true))
        })

        // Add click event on buttons.
        const buttons = this.els.content.element.querySelectorAll(
          'button[data-product-bundle-upsell-add-to-cart]',
        )

        buttons?.forEach(button => {
          this.listeners.add(button, 'click', this.handleModalButtonClick)
        })

        const bundleUpsellElement = document.querySelector(
          `bundle-upsell[data-product-id="${this.productId}"]`,
        )
        const productForm = bundleUpsellElement.querySelector('product-form')
        const wishlistButtons = this.els.content.element.querySelectorAll(
          'button[data-product-form-wishlist-el]',
        )

        wishlistButtons?.forEach(button => {
          button.addEventListener('click', e => {
            productForm.handleWishlistItemSubmission(button)
          })
        })
      }

      async handleModalButtonClick (event) {
        event.preventDefault()

        const button = event.target.closest('button')
        const buttonTimeout = 2000

        // Change button text to loading spinner.
        button.classList.add('loading')

        // Add to cart.
        this.form = event.target.closest('form')
        await this.addToCart(this.form)

        // Change button text to 'added' for X seconds.
        button.classList.remove('loading')

        const defaultButtonText = button.innerHTML

        const buttonText = button.querySelector(
          '[data-product-bundle-upsell-add-to-cart-text]',
        )
        const buttonIcon = button.querySelector('.bup-ButtonIcon')

        buttonText.textContent = 'Added' // todo: translate
        buttonIcon.classList.add('hidden')

        this.addedAnItem = true

        // Change button text back to default icon + 'add to bag'.
        setTimeout(() => {
          button.innerHTML = defaultButtonText
          buttonIcon.classList.remove('hidden')
        }, buttonTimeout)
      }

      async addToCart (form) {
        const formData = new FormData(form)
        const id = Number(formData.get('id'))
        const quantity = Number(formData.get('quantity'))

        this.form = form

        this.item = {
          id,
          quantity,
        }

        const body = {
          items: [this.item],
        }

        const sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
          s => s.section,
        )

        if (sections.length) {
          body.sections = sections
          body.sections_url = window.location.pathname
        }

        this.state = await window.BAO.Cart.cartAdd(body)
      }

      handleContextClick (event) {
        if (event.target.hasAttribute('data-modal-background')) {
          this.close()
        }

        const closeEl = event.target.closest(this.els?.close?.selector)

        if (closeEl) {
          this.close()
        }
      }

      open () {
        document.body.classList.add('overflow-hidden')

        this.setAttribute('aria-hidden', 'false')
      }

      close (openDrawer = true) {
        if (this.addedAnItem) {
          this.emitCartEvents()
        }

        document.body.classList.remove('overflow-hidden')
        this.setAttribute('aria-hidden', 'true')

        if (openDrawer) {
          window.drawers.activeDrawerKey = 'cart'
        }
      }

      emitCartEvents () {
        const state = this.state
        const item = this.item
        const form = this.form

        try {
          window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.AFTER_ADD, {
            item,
            state,
            form,
          })

          window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.CHANGED, {
            state,
          })
        } catch (e) {
          console.error(e)
        }
      }

      async updateContent (html) {
        this.els.content.element.innerHTML = html

        this.attachListeners()

        return true
      }

      get productId () {
        return this.dataset.modalProductId
      }
    },
  )
}
