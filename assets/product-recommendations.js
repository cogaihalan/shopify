if (!customElements.get('cart-item')) {
  customElements.define(
    'product-recommendations',
    class ProductRecommendations extends window.BAO.CustomElement() {
      constructor () {
        super()
        this.init()
      }

      init () {
        if (!this.useRecommendations || !this.url || !this.sectionId) return

        fetch(this.url)
          .then(response => response.text())
          .then(text => {
            const section = document.querySelector(`#${this.sectionId}`)
            if (section) {
              section.innerHTML = text
            }
          })
          .catch(e => {
            console.error(e)
          })
      }

      get useRecommendations () {
        return (
          this.dataset.useRecommendations &&
          this.dataset.useRecommendations === 'true'
        )
      }

      get url () {
        return this.dataset.url ? this.dataset.url : null
      }

      get sectionId () {
        return this.dataset.sectionId ? this.dataset.sectionId : null
      }
    },
  )
}
