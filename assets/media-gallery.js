// eslint-disable-next-line import/no-unresolved
import KeenSlider from 'https://cdn.skypack.dev/keen-slider@5.5.1'
// eslint-disable-next-line import/no-unresolved
import PinchZoom from 'https://cdn.skypack.dev/pinch-zoom-js@2.3.4'

class MediaGallery extends HTMLElement {
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

    this.slidesEl = this.querySelector('[data-el="media-gallery.slides"]')
    this.slideEls = this.querySelectorAll('[data-el="media-gallery.slide"]')
    this.thumbnailsEl = this.querySelector(
      '[data-el="media-gallery.thumbnails"]',
    )
    this.thumbnailEls = this.querySelectorAll(
      '[data-el="media-gallery.thumbnail"]',
    )
    this.dotEls = this.querySelectorAll('[data-el="media-gallery.dot"]')
    this.modalSlideEls = this.querySelectorAll(
      '[data-el="media-gallery.modalSlide"]',
    )
    this.modalSlideImageEls = this.querySelectorAll(
      '[data-el="media-gallery.modalSlideImage"] .rsp-Image',
    )

    this.controlPrevEls = this.querySelectorAll(
      '[data-el="media-gallery.controlprevious"]',
    )
    this.controlNextEls = this.querySelectorAll(
      '[data-el="media-gallery.controlnext"]',
    )

    this.imagesEls = this.querySelectorAll('[data-el="media-gallery.image"]')
    this.imagesEls.forEach(imageEl =>
      imageEl.addEventListener('click', this.mobileZoomImage.bind(this)),
    )

    if (this.slideEls.length < 2) return

    this.gallery = this.initialiseGallery()

    this.controlPrevEls.forEach(controlPrevEl =>
      controlPrevEl.addEventListener('click', this.handleArrowClick.bind(this)),
    )

    this.controlNextEls.forEach(controlNextEl =>
      controlNextEl.addEventListener('click', this.handleArrowClick.bind(this)),
    )

    this.controlNextEls.forEach(controlNextEl =>
      controlNextEl.addEventListener('click', this.handleArrowClick.bind(this)),
    )

    setTimeout(() => {
      this.pinchCheck = this.initialisepinchCheck()
    }, 500)
  }

  initialiseGallery () {
    return new KeenSlider(this.slidesEl, {
      mode: 'snap',
      rtl: false,
      loop: true,
      controls: true,
      spacing: 0,
      slidesPerView: 1,
      slides: '.prd-Media_Slide',
      breakpoints: {},
      created: () => {
        this.dataset.initialized = ' true'
        this.thumbnailEls.forEach(thumbnailEl => {
          thumbnailEl.addEventListener('click', this.handleDotClick.bind(this))
        })

        this.dotEls.forEach(dotEl => {
          dotEl.addEventListener('click', this.handleDotClick.bind(this))
        })

        this.modalSlideImageEls.forEach(modalSlideImageEl => {
          modalSlideImageEl.addEventListener(
            'mousemove',
            this.zoomIn.bind(this),
          )
        })
      },
      slideChanged: instance => {
        this.thumbnailEls.forEach(thumbnailEl => {
          thumbnailEl.setAttribute(
            'aria-current',
            parseInt(thumbnailEl.dataset.slide) ===
              instance.details().relativeSlide,
          )

          if (
            parseInt(thumbnailEl.dataset.slide) ===
            instance.details().relativeSlide
          ) {
            this.thumbnailsEl.scrollTo({
              top: thumbnailEl.offsetTop,
              left: 0,
              behavior: 'smooth',
            })
          }
        })

        this.dotEls.forEach(dotEl => {
          dotEl.setAttribute(
            'aria-current',
            parseInt(dotEl.dataset.slide) === instance.details().relativeSlide,
          )
        })

        this.modalSlideEls.forEach(modalSlideEl => {
          modalSlideEl.setAttribute(
            'aria-current',
            parseInt(modalSlideEl.dataset.slide, 10) ===
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
      },
    })
  }

  handleDotClick (event) {
    this.gallery.moveToSlide(event.target.dataset.slide)
  }

  handleArrowClick (event) {
    if (event.currentTarget.dataset.direction === 'previous') {
      this.gallery.prev()
    } else {
      this.gallery.next()
    }
  }

  mobileZoomImage (image) {
    const mobileImage = this.querySelector('.mod-ModalMobile_Image')
    const imageContainer = document.querySelector('.mod-ModalMobile_Outer')
    const modal = document.querySelector('.mod-ModalMobile')
    const img = image.currentTarget.dataset.image
    mobileImage.src = img

    modal.setAttribute('aria-hidden', 'false')

    this.initialisePinchZoom(imageContainer)
  }

  zoomIn (el) {
    const zoom = el.currentTarget.querySelector('.rsp-Image_Zoom')

    el.offsetX
      ? (document.offsetX = el.offsetX)
      : (document.offsetX = el.touches[0].pageX)
    el.offsetY
      ? (document.offsetY = el.offsetY)
      : (document.offsetX = el.touches[0].pageX)

    const x = (document.offsetX / zoom.offsetWidth) * 100
    const y = (document.offsetY / zoom.offsetHeight) * 100

    zoom.style.backgroundPosition = `${x}% ${y}%`
  }

  initialisePinchZoom (image) {
    this.pinchZoom = new PinchZoom(
      image.querySelector('.mod-ModalMobile_Image'),
      {
        draggableUnzoomed: false,
        minZoom: 0.9,
        maxZoom: 3,
      },
    )
  }

  initialisepinchCheck () {
    const pinchEl = this.querySelector('[data-el="media-gallery.pinch"]')
    const pinchCheck = localStorage.getItem('pinchCheck')

    if (pinchCheck !== 'true') {
      pinchEl.style = 'opacity: 1;'
      setTimeout(() => {
        localStorage.setItem('pinchCheck', true)

        pinchEl.style = 'opacity: 0;'
      }, 5000)
    }
  }
}

customElements.define('media-gallery', MediaGallery)
