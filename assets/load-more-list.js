if (!customElements.get('load-more-list')) {
  customElements.define(
    'load-more-list',
    // eslint-disable-next-line no-undef
    class LoadMoreList extends window.BAO.CustomElement() {
      constructor () {
        super()

        this.currentPage = 1

        this.isTicking = false
        this.lastKnownY = window.scrollY

        this.handleClick = this.handleClick.bind(this)
        this.requestTick = this.requestTick.bind(this)
        this.updateEl = this.updateEl.bind(this)
      }

      setupListeners () {
        super.setupListeners()

        if (this.els.trigger && this.els.trigger.exists) {
          this.listeners.add(
            this.els.trigger.element,
            'click',
            this.handleClick,
          )
        }

        if (this.dataset.infiniteScroll === 'true') {
          this.onScroll = this.onScroll.bind(this)
          window.addEventListener('scroll', this.onScroll, { passive: true })
        }
      }

      handleClick () {
        this.loadMore()
      }

      onScroll () {
        this.lastKnownY = window.scrollY

        this.requestTick()
      }

      requestTick () {
        if (!this.isTicking) requestAnimationFrame(this.updateEl)

        this.isTicking = true
      }

      updateEl () {
        this.isTicking = false

        this.checkTriggerStatus()
      }

      async loadMore () {
        this.loading = true

        // eslint-disable-next-line compat/compat
        const queries = new URLSearchParams(window.location.search)
        queries.set('page', (this.currentPage += 1).toString())

        if (this.options.sectionId && this.options.sectionId.length) {
          queries.set('sections', this.options.sectionId)
        }

        const sectionHTML = await this.fetchSection(queries.toString())
        const newSectionDOM = new DOMParser().parseFromString(
          sectionHTML,
          'text/html',
        )

        this.appendNewItemsToTarget(newSectionDOM)

        // this.setLastRowItems()
        this.loading = false
      }

      checkTriggerStatus () {
        const elementTriggerPoint =
          window.BAO.utils.getOffsetTop(this.els.trigger.element) -
          window.innerHeight -
          window.innerHeight / 2

        if (this.lastKnownY < elementTriggerPoint || this.loading === true) {
          return
        }

        this.loadMore()
      }

      fetchSection (queryString) {
        if (this.options.sectionId && this.options.sectionId.length) {
          return fetch(`${this.options.url}/?${queryString}`)
            .then(response => response.json())
            .then(response => response[this.options.sectionId])
        } else {
          return fetch(`${this.options.url}/?${queryString}`)
            .then(response => response.text())
            .then(response => {
              return response
            })
        }
      }

      appendNewItemsToTarget (DOM) {
        const fragment = document.createDocumentFragment()
        const newItems = window.BAO.utils.getElements(
          this.options.itemSelector,
          { context: DOM },
        )
        newItems.forEach(item => fragment.appendChild(item))

        this.els.target.element.appendChild(fragment)

        if (this.currentItemCount < this.options.totalItems) {
          this.setCurrentAmountViewed()
        } else {
          this.els.pagination.element.remove()

          window.removeEventListener('scroll', this.onScroll, { passive: true })
        }
      }

      setCurrentAmountViewed () {
        if (this.els.text) {
          const buttonText = this.els.text.element.dataset.translation
          this.els.text.element.innerText = buttonText
            ? buttonText.replace('[count]', this.currentItemCount)
            : this.els.text.element.innerText
        }

        if (!this.els.current) return
        this.els.current.element.textContent = this.currentItemCount
      }

      setLastRowItems () {
        const pageSizeModulo =
          this.currentItems.length % this.options.columnCount
        const lastRowStartsAt =
          this.currentItems.length + pageSizeModulo - this.options.columnCount
        this.currentItems.forEach((item, index) => {
          item.setAttribute(
            'data-last-row',
            (index >= lastRowStartsAt).toString(),
          )
        })
      }

      get loading () {
        return this._loading
      }

      set loading (val) {
        this._loading = val

        this.setAttribute('aria-busy', val.toString())
      }

      get currentItems () {
        return window.BAO.utils.getElements(this.options.itemSelector, {
          context: this,
        })
      }

      get currentItemCount () {
        return this.currentItems.length
      }

      get options () {
        return {
          itemSelector: this.dataset.itemSelector
            ? this.dataset.itemSelector
            : '[data-load-more-list-el="item"]',
          perPage: parseInt(
            this.dataset.itemsPerPage ? this.dataset.itemsPerPage : 10,
            10,
          ),
          columnCount: this.dataset.columnCount
            ? parseInt(this.dataset.columnCount, 10)
            : 1,
          currentPage: parseInt(
            this.dataset.currentPage ? this.dataset.currentPage : 1,
            10,
          ),
          totalItems: parseInt(
            this.dataset.totalItems ? this.dataset.totalItems : 1,
            10,
          ),
          sectionId: this.dataset.sectionId ? this.dataset.sectionId : '',
          url: this.dataset.url ? this.dataset.url : '',
        }
      }
    },
  )
}
