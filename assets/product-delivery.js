if (!customElements.get('product-delivery')) {
  customElements.define(
    'product-delivery',
    class ProductDelivery extends window.BAO.CustomElement() {
      setupListeners () {
        this.handleChange = this.handleChange.bind(this)

        this.listeners.add(this.els.select.element, 'change', this.handleChange)
      }

      handleChange (e) {
        this.els.content.elements.forEach(contentEl => {
          contentEl.setAttribute(
            'aria-expanded',
            contentEl.dataset.country === e.target.value,
          )
        })
      }
    },
  )
}
