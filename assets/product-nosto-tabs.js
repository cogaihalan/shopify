class ProductNostoTabs extends HTMLElement {
  constructor () {
    super()

    this.navItemEls = this.querySelectorAll(
      '[data-el="product-nosto-tabs.navItem"]',
    )
    this.tabEls = this.querySelectorAll('[data-el="product-nosto-tabs.tab"]')

    this.handleTabClick()
  }

  handleTabClick () {
    this.navItemEls.forEach(navItemEl => {
      navItemEl.addEventListener('click', this.handleClick.bind(this))
    })
  }

  handleClick (event) {
    const activeTabIndex = event.target.dataset.tabIndex

    this.navItemEls.forEach(navItemEl => {
      if (navItemEl.dataset.tabIndex === activeTabIndex) {
        navItemEl.setAttribute('aria-current', true)
      } else {
        navItemEl.setAttribute('aria-current', false)
      }
    })

    this.tabEls.forEach(tabEl => {
      if (tabEl.dataset.tabIndex === activeTabIndex) {
        tabEl.setAttribute('aria-current', true)
      } else {
        tabEl.setAttribute('aria-current', false)
      }
    })
  }
}

if (!customElements.get('product-nosto-tabs')) {
  customElements.define('product-nosto-tabs', ProductNostoTabs)
}
