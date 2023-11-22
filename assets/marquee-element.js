if (!customElements.get('marquee-element')) {
  customElements.define(
    'marquee-element',
    // eslint-disable-next-line no-undef
    class MarqueeElement extends window.BAO.CustomElement() {
      constructor () {
        super()

        this.innerHTML =
          this.innerHTML + this.innerHTML + this.innerHTML + this.innerHTML
      }
    },
  )
}
