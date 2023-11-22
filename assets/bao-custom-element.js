window.BAO = window.BAO || {}

window.BAO.CustomElement = function CustomElement ({
  SuperClass = HTMLElement,
} = {}) {
  class CustomElement extends SuperClass {
    /**
     * sections - a list of sections that are related to this element. They can be updated by calling
     * the renderSections method with updated HTML
     * @type {Section[]}
     * @public
     */

    constructor () {
      super()

      this.hasBeenInitialised = false
      this.sections = []
      /** @type {Object.<{ exists: boolean, elements: HTMLElement[], element: HTMLElement }>} */
      this.els = this.getElements(this._getElementIdentifiers())
      /** @type {Object.<{ exists: boolean, elements: HTMLElement[], element: HTMLElement }>} */
      this.externalEls = this.getElements(
        this._getExternalElementIdentifiers(),
        this._externalElIdentifier,
        { context: document },
      )
      this.listeners = new window.BAO.utils.Listeners()

      this.checkValidity()
    }

    connectedCallback () {
      if (this.hasBeenInitialised) return

      this.hasBeenInitialised = true

      this.setupListeners()
    }

    disconnectedCallback () {
      this.listeners.removeAll()
    }

    checkValidity () {}

    raiseError (message) {
      throw new Error(`<${this.localName}>: ${message}`)
    }

    setupListeners () {}

    getElements (
      identifiers,
      elementIdentifier = this._elIdentifier,
      { context = this } = {},
    ) {
      return identifiers.reduce((els, identifier) => {
        const selector =
          this.key && elementIdentifier === this._externalElIdentifier
            ? `[${elementIdentifier}="${identifier}"][key="${this.key}"]`
            : `[${elementIdentifier}="${identifier}"]`
        const elements = Array.from(context.querySelectorAll(selector))

        els[identifier] = {
          exists: elements.length > 0,
          elements,
          element: elements[0],
          selector,
        }

        return els
      }, {})
    }

    _getElementIdentifiers () {
      return Array.from(this.querySelectorAll(`[${this._elIdentifier}]`)).map(
        el => el.getAttribute(this._elIdentifier),
      )
    }

    _getExternalElementIdentifiers () {
      const selector = this.key
        ? `[${this._externalElIdentifier}][key="${this.key}"]`
        : `[${this._externalElIdentifier}]`

      return Array.from(document.querySelectorAll(selector)).map(el =>
        el.getAttribute(this._externalElIdentifier),
      )
    }

    /**
     * Renders multiple sections based on sections returned from the cart AJAX API
     *
     * @param {object} stateSections - An object where the keys are section ids and the values are
     *   the HTML returned from the section rendering API
     *
     * @returns {void}
     */
    renderSections (stateSections) {
      if (this.sections.length === 0) return

      const sectionsToRender = this.sections
        .filter(s => s.id in stateSections)
        .map(s => Object.assign({}, s, { html: stateSections[s.id] }))

      window.BAO.utils.sectionRenderer.renderMultiple(sectionsToRender)
    }

    log (groupName, ...otherItems) {
      if (!this.debug) return

      /* eslint-disable no-console */
      console.group(groupName)

      otherItems.forEach(item => console.log(item))

      console.groupEnd()
      /* eslint-enable no-console */
    }

    /**
     * @returns {string}
     */
    get identifier () {
      const baseIdentifier = this.hasAttribute('is')
        ? this.getAttribute('is')
        : this.localName.toLowerCase()

      return baseIdentifier
    }

    /**
     * @private
     * @returns {string}
     */
    get _elIdentifier () {
      return `data-${this.identifier}-el`
    }

    /**
     * @private
     * @returns {string}
     */
    get _externalElIdentifier () {
      return `data-${this.identifier}-external-el`
    }

    get debug () {
      return window.theme.isDevTheme
    }

    get key () {
      return this.getAttribute('key')
    }
  }
  return CustomElement
}
