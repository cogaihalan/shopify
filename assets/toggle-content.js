if (!customElements.get('toggle-content')) {
  customElements.define(
    'toggle-content',
    // eslint-disable-next-line no-undef
    class ToggleContent extends window.BAO.CustomElement() {
      setupListeners () {
        this.handleTrigger = this.handleTrigger.bind(this)

        if (!this.hasEl('trigger') || !this.hasEl('toggle')) return
        this.getEls('trigger').forEach(triggerEl =>
          this.listeners.add(triggerEl, 'click', this.handleTrigger),
        )
      }

      handleTrigger () {
        this.getEls('toggle').forEach(toggleEl =>
          toggleEl.setAttribute(
            'aria-hidden',
            (toggleEl.getAttribute('aria-hidden') !== 'true').toString(),
          ),
        )
      }

      hasEl (key) {
        const hasEl = !!(this.els[key] && this.els[key].element)
        if (!hasEl) {
          this.raiseError(
            `Requires at least one "${key}" element ([data-${this.identifier}-el="${key}"])`,
          )
        }
        return hasEl
      }

      getEls (key) {
        return this.hasEl(key) ? this.els[key].elements : []
      }
    },
  )
}
