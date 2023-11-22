class RangeSlider extends window.BAO.CustomElement() {
  static get requiredAttributes () {
    return ['min', 'max']
  }

  static get requiredElements () {
    return ['touchLeft', 'touchRight', 'line']
  }

  connectedCallback () {
    super.connectedCallback()

    this.startX = 0
    this.x = 0
    this.selectedTouchEl = null

    this.setTouchElPositions()
  }

  setupListeners () {
    super.setupListeners()

    this.onStart = this.onStart.bind(this)
    this.onStop = this.onStop.bind(this)
    this.onMove = this.onMove.bind(this)
    this.setTouchElPositions = this.setTouchElPositions.bind(this)
    this.reset = this.reset.bind(this)

    this.listeners.add(
      this.externalEls.trigger.element,
      'click',
      this.setTouchElPositions,
    )

    this.listeners.add(this.touchLeftEl, 'mousedown', this.onStart)
    this.listeners.add(this.touchRightEl, 'mousedown', this.onStart)
    this.listeners.add(this.touchLeftEl, 'touchstart', this.onStart)
    this.listeners.add(this.touchRightEl, 'touchstart', this.onStart)

    this.onResize = this.onResize.bind(this)
    this.debouncedResize = window.BAO.utils.debounce(event => {
      this.onResize(event)
    }, 240)
    this.listeners.add(window, 'resize', this.debouncedResize)
  }

  reset () {
    const leftX = (this.min / this.max) * this.els.line.element.offsetWidth
    const rightX = (this.max / this.max) * this.els.line.element.offsetWidth

    this.els.minValue.element.innerText = this.formatMoney(this.min)
    this.els.maxValue.element.innerText = this.formatMoney(this.max)

    this.touchLeftEl.style.left = `${leftX}px`
    this.touchRightEl.style.left = `${rightX}px`
    this.touchRightEl.style.right = 'unset'

    const highlighterEl = this.els.highlighter.element

    if (!highlighterEl) return
    this.els.highlighter.element.style = ''
  }

  onResize () {
    this.setTouchElPositions()
  }

  onStart (event) {
    if (event?.button && event?.button !== 0) return

    // Prevent default dragging of selected content
    event.preventDefault()
    this.eventTouch = event.touches ? event.touches[0] : event

    this.selectedTouchEl =
      event.target.closest(this.els.touchLeft.selector) ||
      event.target.closest(this.els.touchRight.selector)

    this.x = this.selectedTouchEl.matches(this.els.touchLeft.selector)
      ? this.touchLeftEl.offsetLeft
      : this.touchRightEl.offsetLeft
    this.startX = this.eventTouch.pageX - this.x

    document.addEventListener('mousemove', this.onMove)
    document.addEventListener('mouseup', this.onStop)
    document.addEventListener('touchmove', this.onMove)
    document.addEventListener('touchend', this.onStop)
  }

  onStop () {
    document.removeEventListener('mousemove', this.onMove)
    document.removeEventListener('mouseup', this.onStop)
    document.removeEventListener('touchmove', this.onMove)
    document.removeEventListener('touchend', this.onStop)

    this.selectedTouchEl = null
  }

  onMove (event) {
    this.eventTouch = event.touches ? event.touches[0] : event

    this.x = this.eventTouch.pageX - this.startX

    if (this.selectedTouchEl.matches(this.els.touchLeft.selector)) {
      if (
        this.x >
        this.touchRightEl.offsetLeft - this.selectedTouchEl.offsetWidth
      ) {
        this.x = this.touchRightEl.offsetLeft - this.selectedTouchEl.offsetWidth
      } else if (this.x < 0) {
        this.x = 0
      }

      this.selectedTouchEl.style.left = `${this.x}px`
      this.minValue = Math.floor(this.max * this.percentage)
      this.setHighlighterPosition(this.x, null)
    }

    if (this.selectedTouchEl.matches(this.els.touchRight.selector)) {
      if (this.x < this.touchLeftEl.offsetLeft + this.touchLeftEl.offsetWidth) {
        this.x = this.touchLeftEl.offsetLeft + this.touchLeftEl.offsetWidth
      } else if (this.x > this.maxX) {
        this.x = this.maxX
      }
      this.selectedTouchEl.style.left = `${this.x}px`
      this.maxValue = Math.ceil(this.max * this.percentage)
      this.setHighlighterPosition(
        null,
        this.els.line.element.offsetWidth - this.x,
      )
    }
  }

  setTouchElPositions () {
    const leftX = (this.minValue / this.max) * this.els.line.element.offsetWidth
    const rightX =
      (this.maxValue / this.max) * this.els.line.element.offsetWidth

    this.els.minValue.element.innerText = this.formatMoney(this.minValue)
    this.els.maxValue.element.innerText = this.formatMoney(this.maxValue)

    this.touchLeftEl.style.left = `${leftX}px`
    this.touchRightEl.style.left = `${rightX}px`
    this.touchRightEl.style.right = 'unset'
    this.setHighlighterPosition(
      leftX,
      this.els.line.element.offsetWidth - rightX,
    )
  }

  setHighlighterPosition (leftX, rightX) {
    if (this.els?.highlighter?.exists) {
      if (leftX) {
        this.els.highlighter.element.style.left = `${leftX}px`
      }

      if (rightX) {
        this.els.highlighter.element.style.right = `${rightX}px`
      }
    }
  }

  get percentage () {
    return this.x / this.els.line.element.offsetWidth
  }

  get min () {
    return this.hasAttribute('min') ? parseFloat(this.getAttribute('min')) : 0
  }

  get max () {
    return this.hasAttribute('max') ? parseFloat(this.getAttribute('max')) : 100
  }

  get maxX () {
    return this.offsetWidth - this.touchRightEl.offsetWidth
  }

  set minValue (value) {
    this.setAttribute('min-value', value)
    this.els.minValue.element.innerText = this.formatMoney(value)

    if (this.minToUpdateEl) {
      this.minToUpdateEl.value = value
      this.minToUpdateEl.dispatchEvent(new Event('input', { bubbles: true }))
    }

    this._minValue = value
  }

  get minValue () {
    if (!this._minValue) {
      return this.hasAttribute('min-value')
        ? parseFloat(this.getAttribute('min-value'))
        : this.min
    }

    return this._minValue
  }

  set maxValue (value) {
    this.setAttribute('max-value', value)
    this.els.maxValue.element.innerText = this.formatMoney(value)

    if (this.maxToUpdateEl) {
      this.maxToUpdateEl.value = value
      this.maxToUpdateEl.dispatchEvent(new Event('input', { bubbles: true }))
    }

    this._maxValue = value
  }

  get maxValue () {
    if (!this._maxValue) {
      return this.hasAttribute('max-value')
        ? parseFloat(this.getAttribute('max-value'))
        : this.max
    }

    return this._maxValue
  }

  get defaultMinValue () {
    const tmpMin = this.minValue >= this.min ? this.minValue : this.min
    return tmpMin > this.defaultMaxValue ? this.defaultMaxValue : tmpMin
  }

  get defaultMaxValue () {
    return this.maxValue >= this.max ? this.maxValue : this.max
  }

  get touchLeftEl () {
    return this.els.touchLeft.element
  }

  get touchRightEl () {
    return this.els.touchRight.element
  }

  get minToUpdateEl () {
    if (
      !this.externalEls?.container?.exists ||
      !this.externalEls?.min?.exists
    ) {
      return
    }
    if (this.closest(this.externalEls.container.selector)) {
      const containerEl = this.closest(this.externalEls.container.selector)
      return window.BAO.utils.getElement(this.externalEls.min.selector, {
        context: containerEl,
      })
    }
  }

  get maxToUpdateEl () {
    if (
      !this.externalEls?.container?.exists ||
      !this.externalEls?.max?.exists
    ) {
      return
    }
    if (this.closest(this.externalEls.container.selector)) {
      const containerEl = this.closest(this.externalEls.container.selector)
      return window.BAO.utils.getElement(this.externalEls.max.selector, {
        context: containerEl,
      })
    }
  }

  formatMoney (value) {
    return `${window.BAO.utils.formatMoney()[0]}${value}`
  }
}

if (!customElements.get('range-slider')) {
  customElements.define('range-slider', RangeSlider)
}
