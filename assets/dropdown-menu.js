let dropdownLoaded = false
class DropdownMenu extends window.BAO.CustomElement() {
  connectedCallback () {
    if (dropdownLoaded) return
    window.BAO.utils.sectionRenderer
      .fetch('header', '/?view=dropdown')
      .then(res => {
        dropdownLoaded = true
        const newDOM = window.BAO.utils.sectionRenderer.convertToDOM(
          res[this.localName],
        )

        const myself = newDOM.querySelector(this.localName)
        this.outerHTML = myself.outerHTML
      })
  }
}

if (!customElements.get('dropdown-menu')) {
  customElements.define('dropdown-menu', DropdownMenu)
}
