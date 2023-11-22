if (!customElements.get('collection-description')) {
  customElements.define(
    'collection-description',
    class CollectionDescription extends window.BAO.CustomElement() {
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

      handleTriggerClick () {
        const triggers = this.els.trigger.elements
        const body = this.els.body.element

        const currentState =
          triggers[0].getAttribute('aria-expanded') === 'true'

        body.setAttribute('aria-visible', !currentState)

        triggers.forEach(trigger => {
          trigger.setAttribute('aria-expanded', !currentState)
        })
      }
    },
  )
}
