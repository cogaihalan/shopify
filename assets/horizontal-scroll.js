if (!customElements.get('horizontal-scroll')) {
  customElements.define(
    'horizontal-scroll',
    // eslint-disable-next-line no-undef
    class ProductCard extends window.BAO.CustomElement() {
      constructor () {
        super()
        this.init()
      }

      init () {
        this.addEventListener('wheel', event => {
          if (this.isScrollable) {
            event.preventDefault()
            this.scrollLeft += event.deltaY
          }
        })
      }

      get isScrollable () {
        return this.scrollWidth > this.clientWidth
      }
    },
  )
}
