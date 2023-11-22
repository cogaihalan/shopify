if (!customElements.get('collection-header-info')) {
  customElements.define(
    'collection-header-info',
    class CollectionHeaderInfo extends window.BAO.CustomElement() {
      constructor () {
        super()
        this.initialize()
      }

      initialize () {
        this.renderText()
      }

      setupListeners () {
        const filterItems = document.querySelectorAll(
          '[data-collection-filters-el="facetItem"]',
        )
        filterItems.forEach(filter => {
          this.listeners.add(filter, 'click', this.renderText.bind(this))
        })

        window.addEventListener(
          'headerInfo::refresh',
          this.renderText.bind(this),
        )
      }

      renderText () {
        const textEl = this.querySelector('[data-collection-header-info-text]')
        const productGrid = this.externalEls['product-grid']

        if (!textEl || !productGrid.exists) return
        const translationString = textEl.getAttribute(
          'data-collection-header-info-text',
        )
        const initialProduct = productGrid.element.dataset.initialProduct
        const currentProducts =
          Number(productGrid.element.dataset.productsPerPage) *
          Number(productGrid.element.dataset.currentPage)

        textEl.innerText = translationString
          .replace('{{ initial_product }}', initialProduct)
          .replace('{{ count }}', currentProducts)
      }
    },
  )
}
