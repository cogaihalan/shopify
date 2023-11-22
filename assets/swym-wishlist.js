if (!customElements.get('swym-wishlist')) {
  customElements.define(
    'swym-wishlist',
    // eslint-disable-next-line no-undef
    class SwymWishlist extends window.BAO.CustomElement() {
      products = []
      currentProducts = []

      constructor () {
        super()
        if (!this.els.items || !this.els.items.element) return
        this.initialize()
      }

      setupListeners () {
        super.setupListeners()
        this.listeners.add(
          this,
          'click',
          this.handleAddAllToBagClick.bind(this),
        )
        this.listeners.add(this, 'click', this.handleRemoveClick.bind(this))
      }

      initialize () {
        this.handleProducts = this.handleProducts.bind(this)
        window.SwymCallbacks = window.SwymCallbacks || []
        window.SwymCallbacks.push(swat => {
          this.swymCallback(swat)
        })
      }

      swymCallback (swat) {
        this.swat = swat
        swat.fetchWrtEventTypeET(products => {
          this.products = products
          this.handleProducts()
        }, 4)
      }

      async handleProducts () {
        this.currentProducts = this.products.slice(
          this.startPoint,
          this.endPoint,
        )
        this.handleStates()
        if (this.currentProducts.length) {
          const productCardHTML = await this.getAllProductCardHTML()
          this.els.items.element.innerHTML = productCardHTML
          this.updateItemIndexes()
        } else {
          this.els.items.element.innerHTML = ''
        }
        this.updatePagination()
      }

      async getAllProductCardHTML () {
        const productCardHTML = await Promise.all(
          this.currentProducts.map(
            async (product, index) =>
              await this.getProductCardHTML(product, index),
          ),
        )
        return productCardHTML.filter(Boolean).join('')
      }

      async getProductCardHTML (product, index) {
        const url = new URL(product.du)
        url.searchParams.append('section_id', this.sectionId)
        return fetch(url)
          .then(r => {
            // Products that don't exist will return a 404
            if (r.status === 200 && r.redirected === false) {
              return r.text()
            }
            return null
          })
          .then(productCardHTML => {
            if (productCardHTML) {
              return `<div class="swym-Wishlist_Item" ${this.selectors.item}
                data-epi="${product.epi}"
                data-du="${product.du}"
                data-empi="${product.empi}"
                data-iu="${product.iu}"
                data-pr="${product.pr}"
                >
                ${window.BAO.utils.sectionRenderer.getInnerHtml(
                  productCardHTML
                    .replace(/\[\[swymVariantTitle\]\]/g, product.vi)
                    .replace(/\[\[swymVariantId\]\]/g, product.epi),
                )}
              </div>`
            }
            return null
          })
      }

      handleAddAllToBagClick (event) {
        const { selector } = this.els.addtobag || {}
        if (!selector || !event.target.closest(this.els.addtobag.selector)) {
          return
        }

        return window.BAO.Cart.addItems(
          this.products.map(product => {
            return {
              id: product.epi,
              quantity: 1,
              properties: {},
            }
          }),
        )
      }

      async handleRemoveClick (event) {
        const removeButton = event.target.closest(`[${this.selectors.remove}]`)
        const item = event.target.closest(`[${this.selectors.item}]`)
        if (!removeButton || !item) return
        item.setAttribute('aria-busy', 'true')
        this.swat.removeFromWishList(Object.assign({}, item.dataset), () => {
          setTimeout(async () => {
            item.remove()
            await this.replaceRemovedCard(item)
            this.updateItemIndexes()
            this.updatePagination()
            this.handleStates()
            window.BAO.dispatchEvent(window.BAO.EVENTS.WISHLIST.UPDATED)
          }, 500)
        })
      }

      async replaceRemovedCard (item) {
        this.products.splice(parseInt(item.dataset.index, 10), 1)
        this.currentProducts = this.products.slice(
          this.startPoint,
          this.endPoint,
        )
        const product = this.products.at(
          this.productsPerPage * this.currentPage - 1,
        )
        if (!product) return
        this.els.items.element.insertAdjacentHTML(
          'beforeend',
          await this.getProductCardHTML(product),
        )
      }

      updateItemIndexes () {
        this.els.items.element
          .querySelectorAll(`[${this.selectors.item}]`)
          .forEach((item, index) => {
            item.setAttribute(
              'data-index',
              (this.currentPage - 1) * this.productsPerPage + index,
            )
          })
      }

      handleStates () {
        this.handleEmptyState()
        this.handleNoMoreItemsState()
      }

      handleEmptyState () {
        if (!this.els.empty || !this.els.empty.element) return
        this.els.empty.element.setAttribute(
          'aria-hidden',
          (this.products.length > 0).toString(),
        )
      }

      handleNoMoreItemsState () {
        if (!this.els.nomoreitems || !this.els.nomoreitems.element) return
        this.els.nomoreitems.element.setAttribute(
          'aria-hidden',
          (this.currentPage === 1 || this.currentProducts.length > 0).toString(),
        )
      }

      updatePagination () {
        const hasPreviousEl = this.els.previous && this.els.previous.element
        const hasNextEl = this.els.next && this.els.next.element

        if (hasPreviousEl) {
          this.els.previous.element.setAttribute(
            'aria-hidden',
            (!this.hasPreviousPage).toString(),
          )
          this.els.previous.element.setAttribute(
            'href',
            `${this.requestPath}/?page=${this.currentPage - 1}`,
          )
        }

        if (hasNextEl) {
          this.els.next.element.setAttribute(
            'aria-hidden',
            (!this.hasNextPage).toString(),
          )
          this.els.next.element.setAttribute(
            'href',
            `${this.requestPath}/?page=${this.currentPage + 1}`,
          )
        }

        if (
          hasPreviousEl &&
          hasNextEl &&
          !this.hasPreviousPage &&
          !this.hasNextPage
        ) {
          this.els.previous.element.remove()
          this.els.next.element.remove()
        }
      }

      get params () {
        const urlSearchParams = new URLSearchParams(window.location.search)
        return Object.fromEntries(urlSearchParams.entries())
      }

      get productsPerPage () {
        return 12
      }

      get currentPage () {
        return this.params.page && parseInt(this.params.page, 10) > 0
          ? parseInt(this.params.page, 10)
          : 1
      }

      get startPoint () {
        return this.productsPerPage * this.currentPage - this.productsPerPage
      }

      get endPoint () {
        return this.productsPerPage * this.currentPage
      }

      get hasPreviousPage () {
        return this.currentPage > 1
      }

      get hasNextPage () {
        return this.products.length > this.productsPerPage * this.currentPage
      }

      get sectionId () {
        return 'swym-product-card'
      }

      set swat (swat) {
        this._swat = swat
      }

      get swat () {
        return this._swat
      }

      get selectors () {
        return {
          item: `data-${this.identifier}-el="item"`,
          remove: `data-${this.identifier}-el="remove"`,
        }
      }

      get requestPath () {
        return this.dataset.requestPath
          ? this.dataset.requestPath
          : '/pages/wishlist'
      }
    },
  )
}
