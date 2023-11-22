if (!customElements.get('ada-button')) {
  customElements.define(
    'ada-button',
    class AdaButton extends window.BAO.CustomElement() {
      setupListeners () {
        super.setupListeners()

        this.startAda = this.startAda.bind(this)

        this.listeners.add(this, 'click', this.startAda)
      }

      startAda () {
        window.adaEmbed.start({
          handle: 'ohpolly',
        })

        this.style.display = 'none'

        this.openAdaWindow()
      }

      openAdaWindow () {
        window.adaEmbed.toggle()
      }
    },
  )
}
