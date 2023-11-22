// eslint-disable-next-line import/no-unresolved
import KeenSlider from 'https://cdn.skypack.dev/keen-slider@5.5.1'

if (!customElements.get('carousel-element')) {
  customElements.define(
    'carousel-element',
    // eslint-disable-next-line no-undef
    class CarouselElement extends window.BAO.CustomElement() {
      constructor () {
        super()
        this.interval = 0
        this.handleAutoplay = (run, instance) => {
          clearInterval(this.interval)
          this.interval = setInterval(() => {
            if (run && instance) {
              instance.next()
            }
          }, 5000)
        }

        this.carousel = this.initializeCarousel()
      }

      initializeCarousel () {
        if (
          window.innerWidth > 1201 &&
          this.slideEls.length <= Math.round(this.configLg.slidesPerView) &&
          this.data.fallbackClasses === 'true'
        ) {
          this.slidesEl.classList.remove('car-Carousel_Slides')

          this.slideEls.forEach(slide => {
            slide.classList.remove('car-Carousel_Slide')
          })

          return
        } else if (
          window.innerWidth > 901 &&
          this.slideEls.length <= Math.round(this.configMd.slidesPerView) &&
          this.data.fallbackClasses === 'true'
        ) {
          this.slidesEl.classList.remove('car-Carousel_Slides')

          this.slideEls.forEach(slide => {
            slide.classList.remove('car-Carousel_Slide')
          })

          return
        } else if (
          window.innerWidth > 901 &&
          this.data.carouselElementEl === 'nosto-pushcart'
        ) {
          this.slidesEl.classList.remove('car-Carousel_Slides')

          this.slideEls.forEach(slide => {
            slide.classList.remove('car-Carousel_Slide')
          })

          return
        } else if (
          window.innerWidth > 768 &&
          this.slideEls.length <= Math.round(this.configSm.slidesPerView) &&
          this.data.fallbackClasses === 'true'
        ) {
          this.slidesEl.classList.remove('car-Carousel_Slides')

          this.slideEls.forEach(slide => {
            slide.classList.remove('car-Carousel_Slide')
          })

          return
        } else if (
          window.innerWidth < 768 &&
          this.slideEls.length <= Math.round(this.configSm.slidesPerView) &&
          this.data.fallbackClasses === 'true'
        ) {
          this.slidesEl.classList.remove('car-Carousel_Slides')

          this.slideEls.forEach(slide => {
            slide.classList.remove('car-Carousel_Slide')
          })

          return
        }

        return new KeenSlider(this.slidesEl, {
          rtl: false,
          mode: this.mode,
          loop: this.loop,
          centered: this.centered,
          rubberband: this.rubberband,
          slides: this.els.slide.selector,
          slidesPerView: this.configXs.slidesPerView,
          controls: this.configXs.controls,
          spacing: this.configXs.spacing,
          breakpoints: {
            '(min-width: 768px)': {
              slidesPerView: this.configSm.slidesPerView,
              controls: this.configSm.controls,
              spacing: this.configSm.spacing,
              centered: this.configSm.centered,
            },
            '(min-width: 901px)': {
              slidesPerView: this.configMd.slidesPerView,
              controls: this.configMd.controls,
              spacing: this.configMd.spacing,
              centered: this.configMd.centered,
            },
            '(min-width: 1201px)': {
              slidesPerView: this.configLg.slidesPerView,
              controls: this.configLg.controls,
              spacing: this.configLg.spacing,
              centered: this.configLg.centered,
            },
          },
          created: instance => {
            this.setAttribute('data-initialized', 'true')
            this.setAttribute('data-itemCount', this.slideEls.length.toString())

            this.dotEls.forEach(dotEl => {
              dotEl.addEventListener('click', this.handleDotClick.bind(this))
            })

            if (this.autoplay) {
              this.slidesEl.addEventListener('mouseover', () => {
                this.handleAutoplay(false, instance)
              })
              this.slidesEl.addEventListener('mouseout', () => {
                this.handleAutoplay(this.autoplay, instance)
              })
              this.handleAutoplay(this.autoplay, instance)
            }

            if (this.nextEl) {
              this.nextEl.addEventListener('click', () => {
                instance.next()
              })
            }

            if (this.previousEl) {
              this.previousEl.addEventListener('click', () => {
                instance.prev()
              })
            }
          },
          slideChanged: instance => {
            this.dotEls.forEach(dot => {
              dot.setAttribute(
                'aria-current',
                parseFloat(dot.dataset.slide) ===
                  instance.details().relativeSlide,
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

            if (this.scrollerEl) {
              let progressTrack = instance.details().progressTrack
              progressTrack = progressTrack >= 1 ? 0 : progressTrack
              const movementPercentage = progressTrack * 100
              this.scrollerEl.style.setProperty(
                '--Carousel_ScrollerMovement',
                `${movementPercentage}%`,
              )
              this.scrollerEl.style.setProperty(
                '--Carousel_ItemCount',
                this.slidesEl.childElementCount,
              )
            }
          },
        })
      }

      handleDotClick (event) {
        this.carousel.moveToSlide(event.target.dataset.slide)
      }

      get slidesEl () {
        return this.els.slides && this.els.slides.element
          ? this.els.slides.element
          : null
      }

      get slideEls () {
        return this.els.slide && this.els.slide.elements
          ? this.els.slide.elements
          : []
      }

      get dotEls () {
        return this.els.dot && this.els.dot.elements
          ? this.els.dot.elements
          : []
      }

      get nextEl () {
        return this.els.next && this.els.next.element
          ? this.els.next.element
          : null
      }

      get previousEl () {
        return this.els.previous && this.els.previous.element
          ? this.els.previous.element
          : null
      }

      get scrollerEl () {
        return this.els.scroller && this.els.scroller.element
          ? this.els.scroller.element
          : null
      }

      get data () {
        return this.dataset ? this.dataset : {}
      }

      get mode () {
        return this.data.mode ? this.data.mode : 'snap'
      }

      get loop () {
        return (
          this.data.loop && this.data.loop.toString().toLowerCase() === 'true'
        )
      }

      get slidesPerView () {
        return this.data.slidesPerView ? parseFloat(this.data.slidesPerView) : 1
      }

      get spacing () {
        return this.data.spacing ? parseFloat(this.data.spacing) : 0
      }

      get centered () {
        return (
          this.data.centered !== undefined &&
          this.data.centered.toString().toLowerCase() === 'true'
        )
      }

      get rubberband () {
        return (
          this.data.rubberband !== undefined &&
          this.data.rubberband.toString().toLowerCase() === 'true'
        )
      }

      get autoplay () {
        return (
          this.data.autoplay !== undefined &&
          this.data.autoplay.toString().toLowerCase() === 'true'
        )
      }

      get changeOnHover () {
        return (
          this.data.changeOnHover !== undefined &&
          this.data.changeOnHover.toString().toLowerCase() === 'true'
        )
      }

      get configDefault () {
        return {
          slidesPerView: this.slidesPerView,
          controls: true,
          spacing: this.spacing,
          centered: this.centered,
        }
      }

      get configXs () {
        return {
          slidesPerView: this.data.slidesPerViewXs
            ? parseFloat(this.data.slidesPerViewXs)
            : this.configDefault.slidesPerView,
          controls:
            (this.data.controlsXs
              ? this.data.controlsXs
              : this.configDefault.controls
            )
              .toString()
              .toLowerCase() === 'true',
          spacing: this.data.spacingXs
            ? parseFloat(this.data.spacingXs)
            : this.configDefault.spacing,
          centered:
            (this.data.centeredXs
              ? this.data.centeredXs
              : this.configDefault.centered
            )
              .toString()
              .toLowerCase() === 'true',
        }
      }

      get configSm () {
        return {
          slidesPerView: this.data.slidesPerViewSm
            ? parseFloat(this.data.slidesPerViewSm)
            : this.configXs.slidesPerView,
          controls:
            (this.data.controlsSm
              ? this.data.controlsSm
              : this.configXs.controls
            )
              .toString()
              .toLowerCase() === 'true',
          spacing: this.data.spacingSm
            ? parseFloat(this.data.spacingSm)
            : this.configXs.spacing,
          centered:
            (this.data.centeredSm
              ? this.data.centeredSm
              : this.configXs.centered
            )
              .toString()
              .toLowerCase() === 'true',
        }
      }

      get configMd () {
        return {
          slidesPerView: this.data.slidesPerViewMd
            ? parseFloat(this.data.slidesPerViewMd)
            : this.configSm.slidesPerView,
          controls:
            (this.data.controlsMd
              ? this.data.controlsMd
              : this.configSm.controls
            )
              .toString()
              .toLowerCase() === 'true',
          spacing: this.data.spacingMd
            ? parseFloat(this.data.spacingMd)
            : this.configSm.spacing,
          centered:
            (this.data.centeredMd
              ? this.data.centeredMd
              : this.configSm.centered
            )
              .toString()
              .toLowerCase() === 'true',
        }
      }

      get configLg () {
        return {
          slidesPerView: this.data.slidesPerViewLg
            ? parseFloat(this.data.slidesPerViewLg)
            : this.configMd.slidesPerView,
          controls:
            (this.data.controlsLg
              ? this.data.controlsLg
              : this.configMd.controls
            )
              .toString()
              .toLowerCase() === 'true',
          spacing: this.data.spacingLg
            ? parseFloat(this.data.spacingLg)
            : this.configMd.spacing,
          centered:
            (this.data.centeredLg
              ? this.data.centeredLg
              : this.configMd.centered
            )
              .toString()
              .toLowerCase() === 'true',
        }
      }
    },
  )
}
