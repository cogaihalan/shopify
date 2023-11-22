if (!customElements.get('product-fixed-bar')) {
  customElements.define(
    'product-fixed-bar',
    // eslint-disable-next-line no-undef
    class ProductFixedBar extends window.BAO.CustomElement() {
      constructor () {
        super()
        this.isPermanentlyClosed = false
      }

      setupListeners () {
        super.setupListeners()

        if (!this.hasExternalEl('mainProductForm')) return

        this.onScroll = this.onScroll.bind(this)
        this.listeners.add(document, 'DOMContentLoaded', this.onScroll)
        this.listeners.add(window, 'scroll', this.onScroll)

        this.handleScrollBackClick = this.handleScrollBackClick.bind(this)
        this.listeners.add(this, 'click', this.handleScrollBackClick)

        if (this.hasEl('close')) {
          this.handleClose = this.handleClose.bind(this)
          this.listeners.add(this, 'click', this.handleClose)
        }
      }

      onScroll () {
        if (this.isPermanentlyClosed) return

        if (this.hasExternalEl('quickBuyContainer')) {
          this.externalEls.quickBuyContainer.element.setAttribute(
            'aria-hidden',
            'true',
          )
        }

        const externalEls = [
          'mainProductForm',
          'mediaColumn',
          'detailColumn',
          'detailHeader',
        ]

        const elInViewport = externalEls.find(
          externalEl =>
            this.hasExternalEl(externalEl) &&
            window.BAO.utils.isInViewport(this.externalEls[externalEl].element),
        )

        if (!elInViewport) {
          document.body.classList.add('product-fixed-bar-active')
        } else {
          document.body.classList.remove('product-fixed-bar-active')
        }

        this.setAttribute('aria-hidden', (!!elInViewport).toString())
      }

      handleClose (event) {
        const closeEl = event.target.closest(this.els.close.selector)
        if (!closeEl) return
        this.isPermanentlyClosed = true
        this.setAttribute('aria-hidden', 'true')
      }

      handleScrollBackClick (event) {
        const fixedButtonEl = event.target.closest(
          this.els.fixedButton.selector,
        )
        if (!fixedButtonEl) return

        window.scrollTo({
          top: this.getOffsetTop(this.externalEls.mainProductForm.element) - 90,
          behavior: 'smooth',
        })
      }

      getOffsetTop (el, parent = document.body, offsetTop = 0) {
        if (!el) return offsetTop

        if (!isNaN(el.offsetTop)) {
          offsetTop += el.offsetTop
        }

        return el.offsetParent === parent
          ? offsetTop
          : this.getOffsetTop(el.offsetParent, parent, offsetTop)
      }

      hasEl (elementName) {
        return this.els[elementName] && this.els[elementName].exists
      }

      hasExternalEl (elementName) {
        return (
          this.externalEls[elementName] && this.externalEls[elementName].exists
        )
      }

      set isPermanentlyClosed (boolean) {
        this._isPermanentlyClosed = boolean
      }

      get isPermanentlyClosed () {
        return this._isPermanentlyClosed
      }
    },
  )
}
