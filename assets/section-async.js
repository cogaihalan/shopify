class SectionAsync extends window.BAO.CustomElement() {
  /**
   * Loads a section asynchronously
   */
  connectedCallback () {
    super.connectedCallback()
    if (!this.sectionId) return
    if (this.loadWhenNeeded) {
      this.observer.observe(this)
    } else {
      this.initialise()
    }
  }

  /**
   * Initialises the custom element
   */
  async initialise () {
    this.isBusy = true

    const html = this.processData(
      await window.BAO.utils.sectionRenderer.fetchSingle(
        this.sectionId,
        this.sectionsUrl,
      ),
    )
    this.sectionHTML = window.BAO.utils.sectionRenderer.getInnerHtml(html)
    this.isBusy = false
    this.isInitialised = true
  }

  /**
   * Replaces variables in the section HTML
   *
   * @param {string} html Section HTML containing variables that need to be replaced
   * @returns {string} HTML with variables replaced
   */
  processData (html) {
    Object.keys(this.data).forEach(key => {
      const replacers = [new RegExp(`{{ ${key} }}`, 'g')]
      replacers.forEach(replacer => {
        html = html.replace(replacer, this.data[key])
      })
    })
    return html
  }

  /**
   * Removes the parent element
   */
  removeParentElement () {
    const elementToRemove = this.parentIdentifier
      ? this.closest(this.parentIdentifier)
      : this
    elementToRemove.remove()
  }

  /**
   * Calls the initialise function when the custom element is intersecting (visible in the viewport)
   */
  intersectionObserverCallback (entries) {
    const entry = entries?.[0]
    if (!entry.isIntersecting || this.isInitialised) return
    this.initialise()
  }

  /**
   * @returns {IntersectionObserver} an observer that specifies when an element is intersecting (visible in viewport)
   */
  get observer () {
    this.intersectionObserverCallback = this.intersectionObserverCallback.bind(
      this,
    )
    // eslint-disable-next-line compat/compat
    return new IntersectionObserver(this.intersectionObserverCallback)
  }

  /**
   * @returns {string} The ID of the section to be rendered
   */
  get sectionId () {
    return this.dataset?.sectionId
  }

  /**
   * @param {html} The HTML to be rendered
   */
  set sectionHTML (html) {
    if (!html) {
      /*
       * When there isn't any HTML we want to remove the parent element
       * to ensure we're not showing other elements of the section
       * such as kicker and title
       */
      this.removeParentElement()
      return
    }
    this.innerHTML = html
  }

  /**
   * @returns {html} The HTML of the section
   */
  get sectionHTML () {
    return this.innerHTML
  }

  /**
   * @param {boolean} Whether or not the element is currently busy
   */
  set isBusy (boolean) {
    this.setAttribute('aria-busy', boolean)
  }

  /**
   * @returns {boolean} Whether or not the element is currently busy
   */
  get isBusy () {
    return this.getAttribute('aria-busy') === 'true'
  }

  /**
   * @returns {sectionRenderer} The BAO sectionRenderer class
   */
  get sectionRenderer () {
    return window.BAO.sectionRenderer
  }

  /**
   * @returns {HTMLelement} The HTML element containing data to be replaced in the rendered HTML
   */
  get dataEl () {
    return this.querySelector('[data-section-async-el="data"]')
  }

  /**
   * @returns {Object} An object containing data to be replaced in the rendered HTML
   */
  get data () {
    return this.dataEl ? JSON.parse(this.dataEl.textContent) : {}
  }

  /**
   * @returns {string} The URL from which to request the section
   */
  get url () {
    return this.dataset?.url
  }

  /**
   * @returns {string} Defines the identifier of a parent element
   */
  get parentIdentifier () {
    return this?.dataset?.parentIdentifier
  }

  /**
   * @returns {string} The url, pathname and query parameters
   */
  get sectionsUrl () {
    return this.url || `${window.location.pathname}${window.location.search}`
  }

  /**
   * @returns {boolean} Whether or not this section should load when it's needed instead of at pageload
   */
  get loadWhenNeeded () {
    return this.dataset?.loadWhenNeeded === 'true'
  }
}

if (!customElements.get('section-async')) {
  customElements.define('section-async', SectionAsync)
}
