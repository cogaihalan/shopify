if (!customElements.get('collection-sort-by')) {
  customElements.define(
    'collection-sort-by',
    class CollectionSortBy extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        this.listeners.add(document.body, 'click', this.toggleMenu.bind(this))
      }

      toggleMenu (event) {
        const menuEl = this.els.menu.element
        if (event.target.closest(this.els.trigger.selector)) {
          const menuIsOpen = menuEl.getAttribute('aria-hidden') === 'true'
          menuEl.setAttribute('aria-hidden', !menuIsOpen)
        } else {
          menuEl.setAttribute('aria-hidden', 'true')
        }
      }
    },
  )
}
