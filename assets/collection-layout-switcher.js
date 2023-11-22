if (!customElements.get('collection-layout-switcher')) {
  customElements.define(
    'collection-layout-switcher',
    class CollectionLayoutSwitcher extends window.BAO.CustomElement() {
      constructor () {
        super()

        this.setView = this.setView.bind(this)

        const view = localStorage.getItem(this.itemKey)

        if (view) {
          this.setView(view)
        }
      }

      setupListeners () {
        super.setupListeners()
        this.els.trigger.elements.forEach(trigger => {
          this.listeners.add(
            trigger,
            'click',
            this.handleTriggerClick.bind(this),
          )
        })
      }

      handleTriggerClick (e) {
        const layoutTrigger = e.target.closest('.clc-Toolbar_Trigger')
        const view = layoutTrigger.dataset.view

        this.setView(view)

        localStorage.setItem(this.itemKey, view)
      }

      setView (view) {
        const productGrid = this.externalEls?.productGrid?.element

        if (!productGrid) return

        productGrid.dataset.view = view

        this.els.trigger.elements.forEach(trigger => {
          const isPressed = trigger.dataset.view === view
          trigger.setAttribute('aria-pressed', isPressed)
        })

        window.BAO.dispatchEvent(window.BAO.EVENTS.COLLECTION.LAYOUT_CHANGED, {
          view,
        })
      }

      get itemKey () {
        return 'BAO-collection-view'
      }
    },
  )
}
