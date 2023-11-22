class LazyVideo {
  constructor () {
    this.lazyVideoEls = document.querySelectorAll('[data-lazy-video]')

    if (this.lazyVideoEls.length === 0) return

    this.setupListeners()
  }

  setupListeners () {
    // Lazy load videos
    document.addEventListener('DOMContentLoaded', () => {
      const options = {
        rootMargin: '200px',
      }
      // eslint-disable-next-line compat/compat
      const lazyVideoObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(video => {
            if (video.isIntersecting) {
              const lazyVideoEl = video.target
              const isProductCard = lazyVideoEl.closest('product-card')

              if (isProductCard && window.innerWidth < 768) return

              if (!lazyVideoEl.classList.contains('util-LazyVideo-loaded')) {
                this.loadLazyVideoEl(lazyVideoEl)
              }

              if (lazyVideoEl.paused && lazyVideoEl.hasAttribute('autoplay')) {
                lazyVideoEl.play()
              }
            } else {
              video.target.pause()
            }
          })
        },
        options,
      )

      this.lazyVideoEls.forEach(lazyVideo => {
        lazyVideoObserver.observe(lazyVideo)
      })
    })
  }

  loadLazyVideoEl (lazyVideoEl) {
    for (const source in lazyVideoEl.children) {
      const videoSource = lazyVideoEl.children[source]
      if (
        typeof videoSource.tagName === 'string' &&
        videoSource.tagName === 'SOURCE'
      ) {
        videoSource.src = videoSource.dataset.src
      }
    }
    lazyVideoEl.load()
    lazyVideoEl.classList.add('util-LazyVideo-loaded')

    if (lazyVideoEl.hasAttribute('autoplay' === false)) {
      document.addEventListener('touchstart', () => {
        if (lazyVideoEl.paused) {
          lazyVideoEl.play()
        }
      })
    }
  }
}

window.BAO.lazyVideo = new LazyVideo()
