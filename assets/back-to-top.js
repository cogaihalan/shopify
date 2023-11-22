if (!customElements.get('back-to-top')) {
  customElements.define(
    'back-to-top',
    class BackToTop extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        this.listeners.add(window, 'scroll', this.onScroll)
      }

      onScroll () {
        const y = window.scrollY
        const topButton = document.querySelector('.clc-Items_BackToTop')

        if (y >= 600) {
          topButton.classList.add('clc-Items_BackToTop-show')
        } else {
          topButton.classList.remove('clc-Items_BackToTop-show')
        }
      }
    },
  )
}
