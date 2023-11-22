if (!customElements.get('drawer-accordion')) {
  customElements.define(
    'drawer-accordion',
    class DrawerAccordion extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        this.listeners.add(
          this.els.trigger.element,
          'click',
          this.handleTriggerClick.bind(this),
        )
      }

      handleTriggerClick () {
        this.style.setProperty(
          '--Max_Height',
          `${this.els.body.element.offsetHeight}px`,
        )

        const currentState = this.getAttribute('aria-expanded') === 'true'

        this.setAttribute('aria-expanded', !currentState)

        if (this.dataset.scrollToTop === 'true') {
          setTimeout(() => this.scrollToAccordionBodyTop(), 500)
        }
      }

      scrollToAccordionBodyTop () {
        const drawer = this.closest('.drw-Drawer')
        const accordionBodyTop = this.els.body.element.getBoundingClientRect()
          .top
        const accordionBodyHeight = this.els.body.element.offsetHeight

        drawer.scrollTo({
          top: accordionBodyTop + accordionBodyHeight,
          behavior: 'smooth',
        })
      }
    },
  )
}
