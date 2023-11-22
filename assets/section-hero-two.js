// eslint-disable-next-line import/no-unresolved
import KeenSlider from 'https://cdn.skypack.dev/keen-slider@5.5.1'

class SectionHero extends HTMLElement {
  constructor () {
    super()

    this.slidesEl = this.querySelector('[data-el="section-hero.slides"]')
    this.slideEls = this.querySelectorAll('[data-el="section-hero.slide"]')
    this.dotEls = this.querySelectorAll('[data-el="section-hero.dot"]')

    if (this.slideEls.length < 2) return

    if (this.dataset.autoplay === 'true') {
      this.interval = 0
      this.autoplay = (run, instance) => {
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          if (run && instance) {
            instance.next()
          }
        }, this.dataset.autoplayDuration)
      }
    }

    this.carousel = this.initialiseCarousel()
  }

  initialiseCarousel () {
    return new KeenSlider(this.slidesEl, {
      duration: 3000,
      loop: true,
      mode: 'snap',
      slides: this.slideEls.length,
      created: instance => {
        this.dotEls.forEach(dotEl => {
          dotEl.addEventListener('click', this.handleDotClick.bind(this))
        })

        if (this.dataset.autoplay === 'true') {
          this.slidesEl.addEventListener('mouseover', () => {
            this.autoplay(false, instance)
          })
          this.slidesEl.addEventListener('mouseout', () => {
            this.autoplay(true, instance)
          })
          this.autoplay(true, instance)
        }
      },
      slideChanged: instance => {
        this.dotEls.forEach(dot => {
          dot.setAttribute(
            'aria-current',
            parseInt(dot.dataset.slide) === instance.details().relativeSlide,
          )
        })
      },
      move: instance => {
        this.slideEls.forEach((slide, index) => {
          slide.setAttribute(
            'aria-hidden',
            index !== instance.details().relativeSlide,
          )
        })
      },
    })
  }

  handleDotClick (event) {
    this.carousel.moveToSlide(event.target.dataset.slide)
  }
}

customElements.define('section-hero', SectionHero)
