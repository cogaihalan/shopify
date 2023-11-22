class CollectionFiltersRenderer {
  /**
   * @param {CollectionFiltersForm} form
   */
  constructor (form) {
    /**
     * @type {CollectionFiltersForm}
     * @public
     */
    this.form = form

    /**
     * @type {CollectionFiltersPaginationRender}
     * @public
     */
    this.paginationRenderer = new CollectionFiltersPaginationRender(this)
  }

  /**
   * @param {Function} filterDataUrl
   * @param {SubmitEvent} e
   *
   * @returns {void}
   */
  fromCache (filterDataUrl, e) {
    const html = this.form.filterData.find(element => filterDataUrl(element))
      .html

    this.form.log('fromCache', { filterDataUrl, e, html })

    this.render(html, e)
  }

  /**
   * @param {String} section
   * @param {String} url
   * @param {SubmitEvent} e
   *
   * @returns {void}
   */
  async fromFetch (section, url, e) {
    const html = await window.BAO.utils.sectionRenderer.fetchSingle(
      section,
      url,
    )

    this.form.log('fromFetch', { section, url, html })

    this.form.filterData.push({ html, url })

    this.render(html, e)

    this.renderProductCount(html)
  }

  /**
   * @param {String} html
   * @param {SubmitEvent|PointerEvent} e
   *
   * @returns {void}
   */
  render (html, e) {
    this.renderFilters(html, e)
    this.renderProductGridContainer(html, e)
    this.paginationRenderer.render(html, e)

    this.renderProductCount(html)

    this.form.loading = false
  }

  /**
   * @param {String} html
   * @param {SubmitEvent} e
   *
   * @returns {void}
   */
  renderFilters (html, e) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html')

    const facetDetailElements = parsedHTML.querySelectorAll(
      this.form.els.facet.selector,
    )

    const facetLabelElements = parsedHTML.querySelectorAll(
      this.form.els['facet-label'].selector,
    )

    this.form.log('renderFilters', {
      e,
      parsedHTML,
      facetDetailElements,
      facetLabelElements,
    })

    facetDetailElements.forEach(element => {
      const selector = `${this.form.els.facet.selector}[data-index="${element.dataset.index}"]`

      const el = document.querySelector(selector)

      element = this.setFacetVisibility(element, el, html)

      el.innerHTML = element.innerHTML
    })

    facetLabelElements.forEach(element => {
      const selector = `${this.form.els['facet-label'].selector}[data-index="${element.dataset.index}"]`

      const el = document.querySelector(selector)
      el.innerHTML = element.innerHTML
    })

    this.renderActiveFacets(parsedHTML)
    this.renderAdditionalElements(parsedHTML)
  }

  setFacetVisibility (element, el, html) {
    const selectors = {
      facetsItem: '[data-collection-filters-el="facetsItem"]',
      facetItem: '[data-collection-filters-el="facetItem"]',
      checkbox: '[data-collection-filters-el="checkbox"]',
      count: '[data-collection-filters-el="count"]',
    }

    const totalProducts = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('[data-product-grid-count]')?.innerHTML

    const updatedFilters = element.querySelectorAll(selectors.facetItem)
    const currentFacetWrapper = el.closest(selectors.facetsItem)

    currentFacetWrapper.setAttribute('aria-hidden', 'false')

    if (updatedFilters.length < 1) {
      currentFacetWrapper.setAttribute('aria-hidden', 'true')
      return element
    }

    const updatedFacetWrapper = element.closest(selectors.facetsItem)
    const facetHasActiveFilter = updatedFacetWrapper.querySelector(
      selectors.checkbox,
    ).checked

    if (!facetHasActiveFilter) {
      const updatedCountEls = element.querySelectorAll(selectors.count)
      const updatedCounts = Array.from(updatedCountEls).map(
        el => el.dataset.count,
      )
      const validFilters = updatedCounts.filter(
        count => count !== totalProducts,
      )

      if (validFilters.length < 1) {
        currentFacetWrapper.setAttribute('aria-hidden', 'true')
        return element
      }
    }

    updatedFilters.forEach(filter => {
      const count = filter.querySelector(selectors.count).dataset.count
      const isSelected = filter.querySelector(selectors.checkbox).checked
      const hideFilter = count === totalProducts && !isSelected

      filter.setAttribute('aria-hidden', hideFilter.toString())
    })

    return element
  }

  /**
   * @param {Document} parsedHTML
   *
   * @returns {void}
   */
  renderActiveFacets (parsedHTML) {
    this.activeFacetSelectors.forEach(selector => {
      const activeFacetElement = parsedHTML.querySelector(selector)

      this.form.log('renderActiveFacets', {
        parsedHTML,
        activeFacetElement,
        selector,
      })

      if (!activeFacetElement) return

      document
        .querySelectorAll(selector)
        .forEach(el => (el.innerHTML = activeFacetElement.innerHTML))
    })
  }

  /**
   * @param {Document} parsedHTML
   *
   * @returns {void}
   */
  renderAdditionalElements (parsedHTML) {}

  /**
   * @param {String} html
   * @param {PointerEvent} e
   *
   * @returns {void}
   */
  renderProductGridContainer (html, e) {
    const direction = this.getPaginationDirection(e)
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html')

    const newItems = document.createDocumentFragment()
    const newProducts = parsedHTML.querySelectorAll(
      '[data-collection-filters-form-external-el="item"]',
    )
    const newPromos = parsedHTML.querySelectorAll(
      '[data-collection-filters-form-external-el="promoItem"]',
    )

    this.setActiveFilterCountText()

    const itemContainer = this.form.externalEls['item-container'].element
    const productGrid = this.form.externalEls['product-grid'].element

    if (newProducts.length === 0) {
      const noProductsToDisplayText = parsedHTML.querySelectorAll(
        '[data-product-grid-empty]',
      )

      itemContainer.innerHTML = ''

      itemContainer.append(noProductsToDisplayText[0])

      return
    }

    newProducts.forEach(el => newItems.appendChild(el))

    const newCurrentPage = parsedHTML
      .querySelector(
        '[data-collection-filters-form-external-el="product-grid"]',
      )
      .getAttribute('data-current-page')

    const newProductsPerPage = parsedHTML
      .querySelector(
        '[data-collection-filters-form-external-el="product-grid"]',
      )
      .getAttribute('data-products-per-page')

    productGrid.setAttribute('data-current-page', newCurrentPage)
    productGrid.setAttribute('data-products-per-page', newProductsPerPage)
    itemContainer.setAttribute('data-page', newCurrentPage)

    this.updateCollectionHeader(productGrid, newCurrentPage)

    const newLastPage = parsedHTML
      .querySelector(
        '[data-collection-filters-form-external-el="product-grid"]',
      )
      .getAttribute('data-last-page')
    productGrid.setAttribute('data-last-page', newLastPage)

    if (direction == null) {
      newPromos.forEach(el => newItems.appendChild(el))

      itemContainer.innerHTML = ''
      itemContainer.append(newItems)
    } else if (direction === 'PREVIOUS') {
      itemContainer.prepend(newItems)
    } else if (direction === 'NEXT') {
      itemContainer.append(newItems)
    }

    this.sortPromos()
  }

  sortPromos () {
    const itemContainer = this.form.externalEls['item-container'].element
    const promos = itemContainer.querySelectorAll(
      '[data-collection-filters-form-external-el="promoItem"]',
    )
    const itemCount = itemContainer.querySelectorAll(
      '[data-collection-filters-form-external-el="item"]',
    ).length

    const isList = itemContainer.dataset.view === 'list'
    const isDesktop = window.innerWidth > 900

    let itemsPerRow = 4
    let span = 2
    if (isList) {
      itemsPerRow = isDesktop ? 3 : 1
      span = isDesktop ? 2 : 3
    } else {
      itemsPerRow = isDesktop ? 4 : 2
      span = isDesktop ? 2 : 4
    }

    promos.forEach((promo, offset) => {
      const desktopIndex = promo.dataset.desktopIndex
      const mobileIndex = promo.dataset.mobileIndex

      if (!desktopIndex && !mobileIndex) return

      const index =
        !desktopIndex && mobileIndex
          ? mobileIndex
          : !isDesktop && !!mobileIndex
              ? mobileIndex
              : desktopIndex

      const itemIndex = parseInt(index) + offset

      const row =
        itemsPerRow === 1 ? itemIndex : Math.floor(itemIndex / itemsPerRow) + 1
      const column = isDesktop ? Math.max(1, itemIndex % itemsPerRow) : 1

      promo.style.setProperty('--PromoColumn', `${column} / span ${span}`)
      promo.style.setProperty('--PromoRow', row)

      promo.style.display = itemIndex > itemCount + offset ? 'none' : 'block'
    })
  }

  setActiveFilterCountText () {
    const activeFilters = document.querySelectorAll(
      '[data-collection-filters-form-el="active-facet"]',
    )
    const activeFilterCountEl = document.querySelector(
      '[data-active-filter-count]',
    )
    if (activeFilterCountEl) {
      activeFilterCountEl.innerText = activeFilters.length
      activeFilterCountEl.parentElement.setAttribute(
        'aria-hidden',
        activeFilters.length === 0,
      )
    }
  }

  /**
   * @param {String} html
   *
   * @returns {void}
   */
  renderProductCount (html) {
    const count = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('[data-product-grid-count]')?.innerHTML

    this.form.log('renderProductCount', {
      html,
      count,
      countElements: this.countElements,
    })

    if (!count) return

    this.setHeaderProductCount()

    this.countElements.forEach(element => (element.innerHTML = count))

    const productsPerPage = Number(
      this.form.externalEls['product-grid'].element.dataset.productsPerPage,
    )

    if (
      document.querySelector(
        '.clc-ProductGrid_Pagination-loadPrevious .pgn-LoadMore_Button',
      )
    ) {
      /* Logic for updating button text if starting point is not page 1 */
      const previousButtonSearch = document.querySelector(
        '.clc-ProductGrid_Pagination-loadPrevious .pgn-LoadMore_Button',
      ).search
      const params = new URLSearchParams(previousButtonSearch)
      const previousPaginatedPage = parseInt(params.get('page'))

      const offset = previousPaginatedPage * productsPerPage
      const initialCount = offset + 1
      const itemsOnPage =
        document.querySelectorAll(
          '[data-collection-filters-form-external-el="item"]',
        ).length + offset

      if (!this?.form?.externalEls?.count?.element) return

      const buttonText = this.form.externalEls.count.element
      const buttonTranslation = buttonText.dataset.translation
      const updatedTranslation = buttonTranslation
        .replace('[count]', itemsOnPage)
        .replace('[initial_product]', initialCount)
        .replace('[total]', count)

      if (
        !document.querySelector(
          '[data-collection-filters-form-external-el="count"]',
        )
      ) {
        return
      }

      document.querySelector(
        '[data-collection-filters-form-external-el="count"]',
      ).textContent = updatedTranslation
    } else {
      /* Logic for updating button text if starting point is page 1 */
      const itemsOnPage = document.querySelectorAll(
        '[data-collection-filters-form-external-el="item"]',
      ).length

      if (!this?.form?.externalEls?.count?.element) return

      const buttonText = this.form.externalEls.count.element
      const buttonTranslation = buttonText.dataset.translation
      const updatedTranslation = buttonTranslation
        .replace('[count]', itemsOnPage)
        .replace('[initial_product]', '1')
        .replace('[total]', count)

      if (
        !document.querySelector(
          '[data-collection-filters-form-external-el="count"]',
        )
      ) {
        return
      }

      document.querySelector(
        '[data-collection-filters-form-external-el="count"]',
      ).textContent = updatedTranslation
    }
  }

  updateCollectionHeader (productGrid, currentPage) {
    const collectionHeaderEl = document.querySelector(
      '[data-collection-filters-external-el="collection-header-info"]',
    )
    const productsPerPage = Number(collectionHeaderEl.dataset.productsPerPage)

    productGrid.setAttribute(
      'data-initial-product',
      Number(currentPage) * productsPerPage - productsPerPage + 1,
    )
    collectionHeaderEl.setAttribute('data-current-page', currentPage)

    const myEvent = new CustomEvent('headerInfo::refresh')
    window.dispatchEvent(myEvent)
  }

  setHeaderProductCount () {
    const headerInfoEl = document.querySelector('collection-header-info')
    headerInfoEl.renderText()
  }

  /**
   * @param {PointerEvent} e
   *
   * @return 'NEXT'|'PREVIOUS'|null
   */
  getPaginationDirection (e) {
    const paginationElement = e?.target?.closest(
      `${this.form.externalEls['load-previous']?.selector}, ${this.form.externalEls['load-more']?.selector}`,
    )
    if (!paginationElement) return null

    return paginationElement === this.form.externalEls['load-previous']?.element
      ? 'PREVIOUS'
      : 'NEXT'
  }

  /**
   * @returns {Element[]}
   */
  get countElements () {
    return document.querySelectorAll('[data-product-grid-count]')
  }

  /**
   * @returns {String[]}
   */
  get activeFacetSelectors () {
    if ('active-facets' in this.form.externalEls) {
      return [this.form.externalEls['active-facets'].selector]
    }

    return [this.form.els['active-facets'].selector]
  }
}

class CollectionFiltersPaginationRender {
  constructor (renderer) {
    /**
     * @type {CollectionFiltersRenderer}
     * @public
     */
    this.renderer = renderer

    this.currentLowestPage =
      Number(
        this.form.externalEls['product-grid'].element.dataset.currentPage,
      ) || 1
    this.currentHighestPage = this.currentLowestPage
  }

  /**
   * @param {string} html
   */
  render (html, e) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html')

    const paginationElement = e?.target?.closest(
      `${this.form.externalEls['load-previous']?.selector}, ${this.form.externalEls['load-more']?.selector}`,
    )
    if (!paginationElement) {
      this.currentLowestPage =
        Number(
          this.form.externalEls['product-grid'].element.dataset.currentPage,
        ) || 1
      this.currentHighestPage = this.currentLowestPage
    }

    this.renderLoadPrevious(parsedHTML)
    this.renderLoadMore(parsedHTML)

    if (this.currentPage < this.currentLowestPage) {
      this.currentLowestPage = this.currentPage
    }

    if (this.currentPage > this.currentHighestPage) {
      this.currentHighestPage = this.currentPage
    }
  }

  /**
   * @param {Document} html
   */
  renderLoadPrevious (html) {
    const loadPreviousContainer = this.form.externalEls['load-previous']
      ?.element
    if (!this.shouldShowLoadPrevious) {
      if (loadPreviousContainer) {
        loadPreviousContainer.innerHTML = ''
      }
      return
    }
    if (!this.shouldRerenderLoadPrevious) return

    this._renderEl('load-previous', html)
  }

  /**
   * @param {Document} html
   */
  renderLoadMore (html) {
    const loadMoreContainer = this.form.externalEls['load-more']?.element
    if (!this.shouldShowLoadMore) {
      if (loadMoreContainer) {
        loadMoreContainer.innerHTML = ''
      }
      return
    }
    if (!this.shouldRerenderLoadMore) return

    this._renderEl('load-more', html)
  }

  /**
   * @param {string} section
   * @param {Document} html
   */
  _renderEl (section, html) {
    const sectionToRenderElement = this.form.externalEls[section]?.element
    if (sectionToRenderElement) {
      sectionToRenderElement.innerHTML = ''
      const newInnerHTML = html.querySelector(
        this.form.externalEls[section].selector,
      )?.innerHTML

      if (newInnerHTML) sectionToRenderElement.innerHTML = newInnerHTML
    }
  }

  get form () {
    return this.renderer.form
  }

  get shouldShowLoadPrevious () {
    const anElementFromTheFirstPageExists = !!document.querySelector(
      `${this.form.externalEls.item?.selector}[data-page="1"]`,
    )
    if (anElementFromTheFirstPageExists) return false

    return this.currentPage > 1
  }

  get shouldShowLoadMore () {
    const anElementFromTheLastPageExists = document.querySelector(
      `${this.form.externalEls.item?.selector}[data-page="${this.lastPage}"]`,
    )
    if (anElementFromTheLastPageExists) return false

    return Number(this.currentPage) < this.lastPage
  }

  get shouldRerenderLoadPrevious () {
    return this.currentPage < this.currentLowestPage
  }

  get shouldRerenderLoadMore () {
    return this.currentPage >= this.currentHighestPage
  }

  get currentPage () {
    const params = this.form.searchParams.current
    const page = params.get('page')

    return Number(page) || 1
  }

  /**
   * @returns {number}
   */
  get lastPage () {
    return Number(
      this.form.externalEls['product-grid'].element.dataset.lastPage,
    )
  }
}

/**
 * @typedef {Object} FilterData
 *
 * @property {string} html
 * @property {string} url
 */

class CollectionFiltersForm extends window.BAO.CustomElement({
  SuperClass: HTMLFormElement,
}) {
  static get requiredExternalElements () {
    return ['container', 'product-grid']
  }

  constructor () {
    super()

    /**
     * @type {Section[]}
     * @public
     */
    this.sections = [
      {
        id: 'template-collection-product-grid',
        section: this.dataset.id,
        selector: '.shopify-section',
      },
    ]

    /**
     * @type {FilterData[]}
     * @public
     */
    this.filterData = []

    /**
     * @type {{ previous: URLSearchParams, current: URLSearchParams, initial: URLSearchParams }}
     * @public
     */
    this.searchParams = {
      // eslint-disable-next-line compat/compat
      previous: new URLSearchParams(window.location.search),
      // eslint-disable-next-line compat/compat
      current: new URLSearchParams(window.location.search),
      // eslint-disable-next-line compat/compat
      initial: new URLSearchParams(window.location.search),
    }

    /**
     * @type {CollectionFiltersRenderer}
     * @public
     */
    this.renderer = new CollectionFiltersRenderer(this)
    this.renderer.sortPromos()

    this.externalEls['item-container'].element.setAttribute('aria-busy', false)
  }

  setupListeners () {
    super.setupListeners()

    this.onFacetRemovalClick = this.onFacetRemovalClick.bind(this)

    this.externalEls['sort-by'].elements.forEach(input => {
      this.listeners.add(input, 'click', this.onSortChange.bind(this))
    })

    this.debouncedOnSubmit = window.BAO.utils.debounce(
      e => this.onSubmit(e),
      700,
    )

    this.listeners.add(this, 'input', this.debouncedOnSubmit.bind(this))

    this.listeners.add(window, 'popstate', this.onHistoryChange.bind(this))

    this.listeners.add(document, 'click', this.onPaginationClick.bind(this))

    this.debouncedSortPromos = window.BAO.utils.debounce(
      () => this.renderer.sortPromos(),
      200,
    )

    window.addEventListener('resize', this.debouncedSortPromos.bind(this))

    window.BAO.eventBus.addEventListener(
      window.BAO.EVENTS.COLLECTION.LAYOUT_CHANGED,
      () => this.renderer.sortPromos(),
    )

    this.repositionToElement()
  }

  /**
   * @param {InputEvent} e
   *
   * @returns {void}
   */
  onSortChange (e) {
    this.els['sort-by'].element.value = e.target.dataset.value
    this.onSubmit(e)
  }

  /**
   * @param {PopStateEvent} e
   *
   * @returns {void}
   */
  onHistoryChange (e) {
    const searchParams = e.state
      ? e.state.searchParams
      : this.form.searchParams.initial
    if (
      searchParams.toString() === this.form.searchParams.previous.toString()
    ) {
      return
    }

    this.form.renderPage({ searchParams, updateURLHash: false })
  }

  /**
   * @param {MouseEvent} e
   *
   * @returns {void}
   */
  onFacetRemovalClick (e) {
    e.preventDefault()

    this.resetPriceRangeValues(e.target)

    const searchParams = e.currentTarget.href.includes('?')
      ? e.currentTarget.href.slice(e.currentTarget.href.indexOf('?') + 1)
      : ''

    this.log('onFacetRemovalClick', { searchParams })

    this.renderPage({ searchParams })
  }

  resetPriceRangeValues (el) {
    this.resetPriceRange(el)
    this.resetRangeSlider()
  }

  resetPriceRange (el) {
    const facetType = el.closest(
      '[data-collection-filters-form-el="active-facet"]',
    ).dataset.facetType

    if (!facetType || facetType !== 'price') return
    const priceRangeMin = document.getElementById('Filter-Price-GTE')
    const priceRangeMax = document.getElementById('Filter-Price-LTE')

    priceRangeMin.value = ''
    priceRangeMax.value = ''
  }

  resetRangeSlider () {
    const rangeSlider = document.querySelector('range-slider')

    if (!rangeSlider) return
    rangeSlider.reset()
  }

  /**
   * @param {MouseEvent} e
   *
   * @returns {void}
   */
  onPaginationClick (e) {
    if (this.constructor.isPaginating) return

    if (!e.target.closest(this.externalEls?.pagination?.selector)) return

    this.constructor.isPaginating = true

    e.preventDefault()

    const anchor = e.target.closest('a')
    this.log('onPaginationClick', { anchor })
    if (!anchor || anchor.getAttribute('href') === '' || anchor.disabled) return

    const href = anchor.getAttribute('href')
    this.log('onPaginationClick', { href })
    // eslint-disable-next-line compat/compat
    const paginationSearchParams = new URLSearchParams(href.split('?')[1])
    const wantedPage = paginationSearchParams.get('page') ?? '1'
    // eslint-disable-next-line compat/compat
    const currentSearchParams = new URLSearchParams(
      this.searchParams.current.toString(),
    )
    currentSearchParams.set('page', wantedPage)

    this.renderPage({ searchParams: currentSearchParams.toString(), e })
  }

  repositionToElement () {
    if (!sessionStorage.getItem('lastClickedProductCard')) return

    const lastClickedProductCard = sessionStorage.getItem(
      'lastClickedProductCard',
    )

    const element = document
      .querySelector(
        '[data-collection-filters-form-external-el="item-container"]',
      )
      .querySelector(`[data-product-handle="${lastClickedProductCard}"]`)

    const offset =
      document.querySelector('.hd-AnnouncementBar').clientHeight +
      document.querySelector('.lyt-Header').clientHeight +
      document.querySelector('.clc-Toolbar').clientHeight

    if (element) {
      element.style.setProperty('--offset', `${offset}px`)
      element.scrollIntoView({ behavior: 'instant', block: 'start' })
    }

    sessionStorage.removeItem('lastClickedProductCard')
  }

  /**
   * @param {InputEvent} e
   *
   * @returns {void}
   */
  onSubmit (e) {
    e.preventDefault()

    const formData = new FormData(this)
    // eslint-disable-next-line compat/compat
    const searchParams = new URLSearchParams(formData).toString()

    this.renderPage({ searchParams, e })
  }

  /**
   * @param {Object}
   * @param {String} searchParams
   * @param {InputEvent} [e]
   * @param {Boolean} [updateURLHash]
   *
   * @returns {void}
   */
  renderPage ({ searchParams, e, updateURLHash = true } = {}) {
    this.log('renderPage', { searchParams, e, updateURLHash })

    this.searchParams.previous = this.searchParams.current
    // eslint-disable-next-line compat/compat
    this.searchParams.current = new URLSearchParams(searchParams)

    this.loading = true

    this.sections.forEach(async section => {
      const url = `${window.location.pathname}?section_id=${
        section.section
      }&${this.searchParams.current.toString()}`
      /**
       * @param {FilterData} element
       *
       * @returns {Boolean}
       */
      const filterDataUrl = element => element.url === url

      this.log('renderPageSections', { section, url })

      this.filterData.some(element => filterDataUrl(element))
        ? this.renderer.fromCache(filterDataUrl, e)
        : this.renderer.fromFetch(section.section, url, e)
    })

    if (updateURLHash) this.updateURLHash(this.searchParams.current)
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

  /**
   * @returns {Boolean}
   */
  get loading () {
    return this._loading
  }

  /**
   * @param {Boolean} val
   *
   * @returns {void}
   */
  set loading (val) {
    this._loading = val

    this.setAttribute('aria-busy', val.toString())

    this.externalEls?.container.element.setAttribute(
      'aria-busy',
      val.toString(),
    )

    if (val === false) {
      this.constructor.isPaginating = false
    }
  }
}

if (!customElements.get('collection-filters-form')) {
  customElements.define('collection-filters-form', CollectionFiltersForm, {
    extends: 'form',
  })
}

class FacetRemove extends window.BAO.CustomElement() {
  setupListeners () {
    super.setupListeners()

    this.listeners.add(this.querySelector('a'), 'click', e => {
      e.preventDefault()

      this.form.onFacetRemovalClick(e)
    })
  }

  get form () {
    const selector = 'collection-filters-form, [is="collection-filters-form"]'

    return this.closest(selector) || document.querySelector(selector)
  }
}

if (!customElements.get('facet-remove')) {
  customElements.define('facet-remove', FacetRemove)
}

class FilterFacet extends window.BAO.CustomElement({
  SuperClass: HTMLDetailsElement,
}) {
  static get requiredElements () {
    return ['summary', 'content']
  }

  constructor () {
    super()

    /**
     * @type {Animation|null}
     * @public
     */
    this.animation = null

    /**
     * @type {Boolean}
     * @public
     */
    this.isClosing = false

    /**
     * @type {Boolean}
     * @public
     */
    this.isExpanding = false
  }

  setupListeners () {
    super.setupListeners()

    this.onSummaryClick = this.onSummaryClick.bind(this)

    this.listeners.add(this, 'click', this.onSummaryClick)
  }

  /**
   * @param {MouseEvent} e
   *
   * @returns {void}
   */
  onSummaryClick (e) {
    if (!e.target.closest(this.els.summary.selector)) return

    e.preventDefault()

    if (this.isClosing || !this.open) {
      this.start()
    } else if (this.isExpanding || this.open) {
      this.close()
    }
  }

  start () {
    this.open = true

    window.requestAnimationFrame(() => this.expand())
  }

  close () {
    this.shrink()
  }

  shrink () {
    this.isClosing = true

    if (this.animation) {
      this.animation.cancel()
    }

    this.animation = this.content.animate(
      {
        opacity: [1, 0],
        transform: ['none', 'translateY(-15px)'],
      },
      { duration: 400, easing: 'ease' },
    )

    this.animation.onfinish = () => this.onAnimationFinish(false)
    this.animation.oncancel = () => (this.isClosing = false)
  }

  expand () {
    this.isExpanding = true

    if (this.animation) {
      this.animation.cancel()
    }

    this.animation = this.content.animate(
      {
        opacity: [0, 1],
        transform: ['translateY(-15px)', 'none'],
      },
      { duration: 400, easing: 'ease' },
    )

    this.animation.onfinish = () => this.onAnimationFinish(true)
    this.animation.oncancel = () => (this.isExpanding = false)
  }

  /**
   * @param {Boolean} open
   *
   * @returns {void}
   */
  onAnimationFinish (open) {
    this.open = open
    this.animation = null

    this.isClosing = false
    this.isExpanding = false
  }

  get content () {
    return this.querySelector(this.els.content.selector)
  }
}

if (!customElements.get('filter-facet')) {
  customElements.define('filter-facet', FilterFacet, { extends: 'details' })
}
