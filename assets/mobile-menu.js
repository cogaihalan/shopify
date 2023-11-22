let dropdownLoaded = false
if (!customElements.get('mobile-menu')) {
  customElements.define(
    'mobile-menu',
    class MobileMenu extends window.BAO.CustomElement() {
      connectedCallback () {
        if (dropdownLoaded) return
        this.fetchMobileMenuHTML()
      }

      async fetchMobileMenuHTML () {
        let rootUrl = '/'
        if (window.langify) {
          rootUrl = window.langify.locale.root_url
        }

        const html = await window.BAO.utils.sectionRenderer.fetchSingle(
          'mobile-menu',
          `${rootUrl}?view=mobile-menu`,
        )

        dropdownLoaded = true
        const newDOM = window.BAO.utils.sectionRenderer.convertToDOM(html)
        const myself = newDOM.querySelector('#shopify-section-mobile-menu')

        this.outerHTML = myself.innerHTML
      }
    },
  )
}
