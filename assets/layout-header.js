let dropdownLoaded = false
if (!customElements.get('layout-header')) {
  customElements.define(
    'layout-header',
    class LayoutHeader extends window.BAO.CustomElement() {
      constructor () {
        super()
        this.initialize()
      }

      initialize () {
        this.lightTransparentRanges = this.calculateTransparentRanges('light')
        this.darkTransparentRanges = this.calculateTransparentRanges('dark')

        this.bannerOffset = this.getOffsetTop(this)

        this.isTicking = false
        this.lastKnownY = window.scrollY

        this.onScroll = this.onScroll.bind(this)
        this.updateEl = this.updateEl.bind(this)

        this.setupListeners()

        this.updateEl()

        if (dropdownLoaded) {
          return
        }

        this.fetchHeaderHTML()
      }

      async fetchHeaderHTML () {
        let rootUrl = '/'
        if (window.langify) {
          rootUrl = window.langify.locale.root_url
        }

        const html = await window.BAO.utils.sectionRenderer.fetchSingle(
          'header',
          `${rootUrl}?view=dropdown`,
        )

        dropdownLoaded = true
        const newDOM = window.BAO.utils.sectionRenderer.convertToDOM(html)
        const desktopNav = newDOM.querySelector('.hd-Banner_Nav')

        this.querySelector('.hd-Banner_Nav').innerHTML = desktopNav.innerHTML

        this.els = this.getElements(this._getElementIdentifiers())

        if (this.els.menuItem && this.els.menuItem.exists) {
          this.toggleMenu = this.toggleMenu.bind(this)
          this.listeners.add(this, 'focusin', this.toggleMenu)
          this.listeners.add(document.body, 'mouseover', this.toggleMenu)
        }
      }

      setupListeners () {
        window.addEventListener('resize', this.onResize)

        window.addEventListener('scroll', this.onScroll)
      }

      toggleMenu (event) {
        let expanded = false

        const parentMenuItemEl = event.target.closest(
          this.els.menuItem.selector,
        )
        this.els.menuItem.elements.forEach(menuItemEl => {
          if (menuItemEl === parentMenuItemEl) {
            expanded = true
          }
          menuItemEl.setAttribute(
            'aria-expanded',
            menuItemEl === parentMenuItemEl,
          )
        })

        this.classList.toggle(this.classes.active, expanded)
      }

      requestTick () {
        if (!this.isTicking) requestAnimationFrame(this.updateEl)

        // If a rAF is already queued we don't want to call another one
        this.isTicking = true
      }

      onScroll () {
        this.lastKnownY = window.scrollY
        this.requestTick()
      }

      updateEl () {
        // Reset the tick so we can capture the next onScroll
        this.isTicking = false

        // Do fun stuffs here
        this.bodyEl.classList.toggle(
          this.classes.transparent,
          this.bannerIsOverTransparentArea(this.lastKnownY),
        )

        this.bodyEl.classList.toggle(
          this.classes.hasScrolled,
          this.lastKnownY > 0,
        )
      }

      bannerIsOverTransparentArea (y) {
        const yWithOffset = y + this.bannerOffset
        const { offsetHeight: bannerHeight } = this

        const isLight = this.lightTransparentRanges.some(range => {
          return (
            range.start <= yWithOffset &&
            yWithOffset + bannerHeight <= range.end
          )
        })

        const isDark = this.darkTransparentRanges.some(range => {
          return (
            range.start <= yWithOffset &&
            yWithOffset + bannerHeight <= range.end
          )
        })

        this.classList.toggle(this.classes.light, isLight)

        this.classList.toggle(this.classes.dark, isDark)

        return isLight || isDark
      }

      calculateTransparentRanges (textColour) {
        const transparentElements = document.querySelectorAll(
          `[data-header-is-transparent-when-over-me="${textColour}"]`,
        )
        if (!transparentElements || !transparentElements.length) return []
        return Array.from(transparentElements).map(el =>
          this.calculateTransparentRangeForElement(el),
        )
      }

      calculateTransparentRangeForElement (element) {
        const start = this.getOffsetTop(element)

        return {
          start,
          end: start + element.offsetHeight,
        }
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

      get menuItemEls () {
        return this.els.menuItem ? this.els.menuItem.elements : []
      }

      get bodyEl () {
        return this.externalEls.body ? this.externalEls.body.element : null
      }

      get classes () {
        return {
          hasScrolled: 'lyt-Site-hasScrolled',
          transparent: 'lyt-Site-transparentHeader',
          active: 'lyt-Header-active',
          light: 'lyt-Header-light',
          dark: 'lyt-Header-dark',
        }
      }

      get currentMenuItem () {
        return this._currentMenuItem
      }

      set currentMenuItem (element) {
        this._currentMenuItem = element
      }
    },
  )
}
