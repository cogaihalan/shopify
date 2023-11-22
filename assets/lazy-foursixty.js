// eslint-disable-next-line no-undef
class LazyFourSixty extends window.BAO.CustomElement() {
  setupListeners () {
    super.setupListeners()

    window.addEventListener('scroll', this.onScroll.bind(this))
  }

  onScroll () {
    const parentOffset = this.getBoundingClientRect()
    const top = parentOffset.top - window.innerHeight

    if (top < 0) {
      window.removeEventListener('scroll', this.onScroll)
      this.bindFourSixty()
    }
  }

  bindFourSixty () {
    this.els.script.element.src = this.els.script.element.dataset.src
  }
}

if (!customElements.get('lazy-foursixty')) {
  customElements.define('lazy-foursixty', LazyFourSixty)
}
