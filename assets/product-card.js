if (!customElements.get('product-card')) {
  customElements.define(
    'product-card',
    // eslint-disable-next-line no-undef
    class ProductCard extends window.BAO.CustomElement() {
      constructor () {
        super()
        this.initialize()
      }

      initialize () {
        this._productOptionHTML = {}
      }

      setupListeners () {
        super.setupListeners()

        if (!this.productHandle) return

        this.listeners.add(this, 'click', this.handleSave.bind(this))

        if (this.hasEl('desktopTrigger')) {
          this.listeners.add(
            this.els.desktopTrigger.element,
            'click',
            this.handleDesktopTrigger.bind(this),
          )
        }

        if (this.hasEl('mobileTrigger')) {
          this.els.mobileTrigger.elements.forEach(mobileTrigger =>
            this.listeners.add(
              mobileTrigger,
              'click',
              this.handleMobileTrigger.bind(this),
            ),
          )
        }

        if (this.id) {
          this.listeners.add(
            this.els.link.element,
            'click',
            this.handleLinkClickWithID.bind(this),
          )
        }

        if (!window.quickBuy) {
          window.quickBuy = {
            handleClose: this.handleClose.bind(this),
          }
        }

        if (this.hasEl('wishlistButton')) {
          window.BAO.eventBus.addEventListener(
            window.BAO.EVENTS.PRODUCT.VARIANT_CHANGED,
            this.handleVariantChange.bind(this),
          )
          this.listeners.add(
            this.els.wishlistButton.element,
            'click',
            this.handleWishlistButtonClick.bind(this),
          )
        }

        if (this.hasEl('quickBuyOverlay')) {
          this.listeners.add(
            this.els.quickBuyOverlay.element,
            'click',
            this.handleClose.bind(this),
          )
        }

        this.listeners.add(
          this.externalEls.quickBuyOverlay.element,
          'click',
          this.handleClose.bind(this),
        )
      }

      handleVariantChange (event) {
        const wishlistButtonEls = [
          this.els?.wishlistButton?.element,
          this.externalEls?.wishlistButton?.element,
        ].filter(Boolean)

        wishlistButtonEls.forEach(wishlistButtonEl => {
          if (
            wishlistButtonEl.dataset.productId.toString() !==
            event.detail.product.id.toString()
          ) { return }
          wishlistButtonEl.setAttribute(
            'data-variant-id',
            event.detail.variant.id.toString(),
          )
          if (
            window.wishlistProducts &&
            Array.isArray(window.wishlistProducts)
          ) {
            const wishlistVariant = window.wishlistProducts.find(
              product =>
                product.epi.toString() === event.detail.variant.id.toString(),
            )
            wishlistButtonEl.setAttribute(
              'data-wishlist-status',
              wishlistVariant ? 'added' : '',
            )
          }
        })
      }

      /**
       * Handles the click event on a wishlist button, toggling items in the wishlist by adding or removing them based on their current status.
       *
       * @param {Event} event - The triggered click event object containing information about the event.
       */

      handleWishlistButtonClick (event) {
        const trigger = event.currentTarget

        if (trigger.dataset.wishlistStatus === 'added') {
          this.removeFromWishlist(trigger)
        } else {
          this.addToWishlist(trigger)
        }
      }

      handleSave (event) {
        sessionStorage.setItem('lastClickedProductCard', this.productHandle)
      }

      removeFromWishlist (wishlistButtonEl) {
        window._swat.removeFromWishList(
          {
            epi: parseInt(wishlistButtonEl.dataset.variantId, 10),
            du: `${wishlistButtonEl.dataset.productUrl}?variant=${wishlistButtonEl.dataset.variantId}`,
            empi: parseInt(wishlistButtonEl.dataset.productId, 10),
          },
          () => {
            wishlistButtonEl.removeAttribute('data-wishlist-status')
            window.BAO.dispatchEvent(window.BAO.EVENTS.WISHLIST.UPDATED)
          },
        )
      }

      addToWishlist (wishlistButtonEl) {
        window._swat.addToWishList(
          {
            epi: parseInt(wishlistButtonEl.dataset.variantId, 10),
            du: `${wishlistButtonEl.dataset.productUrl}`,
            empi: parseInt(wishlistButtonEl.dataset.productId, 10),
          },
          () => {
            window.BAO.dispatchEvent(window.BAO.EVENTS.WISHLIST.UPDATED)
          },
        )
      }

      handleLinkClickWithID (event) {
        event.preventDefault()

        const queries = new URLSearchParams(window.location.search)
        queries.set('page', this.getAttribute('current-page'))
        this.updateURLHash(queries)

        window.location.hash = this.id

        window.location.href = event.target.href
      }

      /**
       * @param {URLSearchParams} searchParams
       *
       * @returns {void}
       */
      updateURLHash (searchParams) {
        history.pushState(
          { searchParams: searchParams.toString() },
          '',
          `${window.location.pathname}${searchParams &&
            '?'.concat(searchParams.toString())}`,
        )
      }

      handleDesktopTrigger (event) {
        const trigger =
          event.target.closest(this.els.desktopTrigger?.selector) ||
          event.target.closest(this.els.wishlistButton?.selector)
        if (!trigger) return

        /* Close open containers first */
        this.handleClose()

        if (!this.hasEl('quickBuyContainer')) return

        if (trigger.hasAttribute('data-buy-trigger')) {
          this.els.quickBuyContainer.element.setAttribute('data-mode', 'buy')
        }

        if (trigger.hasAttribute('data-wishlist-trigger')) {
          this.els.quickBuyContainer.element.setAttribute(
            'data-mode',
            'wishlist',
          )
        }

        this.renderProductForm(this.els.quickBuyContainer.element)
      }

      handleMobileTrigger (event) {
        const trigger = event.target.closest(this.els.mobileTrigger.selector)
        if (!trigger) return

        /* Close open containers first */
        this.handleClose()

        if (!this.hasExternalEl('quickBuyContainer')) return

        if (this.hasExternalEl('fixedBar')) {
          this.externalEls.fixedBar.element.setAttribute('aria-hidden', 'true')
        }

        this.renderProductForm(this.externalEls.quickBuyContainer.element)
      }

      handleClose () {
        const quickBuyContainers = [
          ...window.BAO.utils.getElements(this.els.quickBuyContainer.selector),
          ...window.BAO.utils.getElements(
            this.externalEls.quickBuyContainer
              ? this.externalEls.quickBuyContainer.selector
              : null,
          ),
        ]

        quickBuyContainers.forEach(quickBuyContainer => {
          quickBuyContainer.removeAttribute('data-mode')

          const productCard = quickBuyContainer.closest(this.tagName)
          if (productCard) {
            productCard.setAttribute('data-quick-buy-active', false)
          }
          quickBuyContainer.setAttribute('aria-hidden', true)
        })
      }

      async renderProductForm (quickBuyContainer) {
        window.BAO.dispatchEvent(window.BAO.EVENTS.QUICKBUY.BEFORE_OPTIONS_LOAD)
        /* Set data attribute on product */
        this.setAttribute('data-quick-buy-active', true)

        /* Set the state of the quickbuy container to busy so we can add custom styling */
        /* (Keep pointer events disabled while loading) */
        quickBuyContainer.setAttribute('aria-busy', true)

        /* Show the quickbuy container */
        quickBuyContainer.setAttribute('aria-hidden', false)

        /* Render the quickbuy container over the pushcart if the trigger is in the pushcart */
        this.handleMobilePushcartQuickBuy(quickBuyContainer)

        /* Check if we already have the html - if not, request it */
        if (!this._productOptionHTML[this.productHandle]) {
          this._productOptionHTML[
            this.productHandle
          ] = await this.fetchProductOptionsHTML()
        }

        /* Inject the the option html into the quickbuy container */
        quickBuyContainer.innerHTML = this._productOptionHTML[
          this.productHandle
        ]

        /* Change the state to no longer be busy */
        /* (Re enable pointer events) */
        quickBuyContainer.setAttribute('aria-busy', false)

        this.setupExternalWishlistButton(quickBuyContainer)

        window.BAO.dispatchEvent(window.BAO.EVENTS.QUICKBUY.AFTER_OPTIONS_LOAD)
      }

      handleMobilePushcartQuickBuy (quickBuyContainer) {
        const pushcartIsOpen = document.body.classList.contains(
          'drw-Drawers-cart',
        )
          ? 'true'
          : 'false'

        quickBuyContainer.setAttribute(
          'data-push-cart-quick-buy',
          pushcartIsOpen,
        )
      }

      setupExternalWishlistButton (quickBuyContainer) {
        const externalWishlistButtonEl = quickBuyContainer.querySelector(
          this.externalWishlistButtonSelector,
        )
        if (!externalWishlistButtonEl) return

        this.externalEls.wishlistButton = this.externalEls.wishlistButton || {}
        this.externalEls.wishlistButton.element = externalWishlistButtonEl

        this.listeners.remove(
          externalWishlistButtonEl,
          'click',
          this.handleWishlistButtonClick.bind(this),
        )
        this.listeners.add(
          externalWishlistButtonEl,
          'click',
          this.handleWishlistButtonClick.bind(this),
        )
      }

      async fetchProductOptionsHTML () {
        /* Fetch the quickbuy section from the product page */
        return await fetch(
          `/products/${this.productHandle}?section_id=${this.quickbuySectionId}`,
        )
          .then(response => response.text())
          .then(responseText => {
            return responseText
          })
      }

      hasEl (elementName) {
        return this.els[elementName] && this.els[elementName].exists
      }

      hasExternalEl (elementName) {
        return (
          this.externalEls[elementName] && this.externalEls[elementName].exists
        )
      }

      get productHandle () {
        return this.dataset.productHandle ? this.dataset.productHandle : null
      }

      get quickbuySectionId () {
        return 'product-quickbuy'
      }

      get externalWishlistButtonSelector () {
        return '[data-product-card-external-el="wishlistButton"]'
      }
    },
  )
}
