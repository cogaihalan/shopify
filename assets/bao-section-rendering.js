/**
 * The makeup of a section to be used by our SectionRenderer
 *
 * @typedef {Object} Section
 * @property {String} id - The ID of the section. This will be the filename of the section
 * @property {String} selector - The CSS selector which contains the sections content
 * @property {String} html - This is the HTML returned by the section rendering API
 * @property {Function} convertor - This will be ran on the new HTML before it's inserted into the
 * @property {Boolean} dontRender - Sometimes we want to get a section back but no render it, like
 *   a cart count DOM
 */
window.BAO.utils.sectionRenderer = new (class SectionRenderer {
  /**
   * Request a section, or sections, from the section rendering API
   *
   * @param {string|string[]} sections - The names of the sections we want to fetch
   * @param {string} [sectionsUrl] - The context in which we want the sections to be
   *   rendered in
   *
   * @returns {Promise<Object>}
   */
  async fetch (sections, sectionsUrl = this.sectionsUrl) {
    if (typeof sections === 'string') {
      sections = [sections]
    }

    const [path, querystring = ''] = sectionsUrl.split('?')

    // eslint-disable-next-line compat/compat
    const params = new URLSearchParams(querystring)
    params.append('sections', sections.join(','))

    const section = await fetch(`${path}?${params.toString()}`)

    return section.json()
  }

  /**
   * Request a single section from the section rendering API
   * https://shopify.dev/api/section-rendering#request-a-single-section
   *
   * @param {string} section - The names of the section we want to fetch
   * @param {string} [sectionsUrl] - The context in which we want the sections to be
   *   rendered in
   *
   * @returns {Promise<string>}
   */
  async fetchSingle (section, sectionsUrl = this.sectionsUrl) {
    const [path, querystring = ''] = sectionsUrl.split('?')

    // eslint-disable-next-line compat/compat
    const params = new URLSearchParams(querystring)
    params.set('section_id', section)

    const response = await fetch(`${path}?${params.toString()}`)

    return response.text()
  }

  /**
   * Render a section returned from the section rendering API
   *
   * @param {Section} section - The makeup of the section we want to render
   *
   * @returns {void}
   */
  render (section) {
    if ('dontRender' in section && section.dontRender) return

    this.validate(section)

    if (document.getElementById(section.id) === null) return

    const elementToReplace =
      document.getElementById(section.id).querySelector(section.selector) ||
      document.getElementById(section.id)

    const newHTML = this.getInnerHtml(section.html, section.selector)
    const oldHTML = elementToReplace.outerHTML

    elementToReplace.outerHTML =
      typeof section.convertor === 'function'
        ? section.convertor(oldHTML, newHTML)
        : newHTML
  }

  /**
   * Render multiple sections returned from the section rendering API
   *
   * @param {Section[]} sections - The sections we want to render
   *
   * @returns {void}
   */
  renderMultiple (sections) {
    sections.forEach(section => this.render(section))
  }

  /**
   * Grab the HTML that is inside the section otherwise we end up with section inception
   *
   * @param {String} html - The section HTML returned from the section rendering API
   * @param {String} selector - The CSS selector which contains the sections content
   *
   * @returns {String}
   */
  getInnerHtml (html, selector = '.shopify-section') {
    return this.convertToDOM(html).querySelector(selector).innerHTML
  }

  /**
   * Convert a HTML string into a parseable DOM
   *
   * @param {String} html
   *
   * @returns {Document}
   */
  convertToDOM (html) {
    return new DOMParser().parseFromString(html, 'text/html')
  }

  /**
   * Render a section returned from the section rendering API
   *
   * @param {Section} section - The makeup of the section we want to render
   *
   * @returns {Boolean}
   */
  validate (section) {
    const isValid = this.expectedKeys.every(key => key in section)

    if (!isValid) {
      throw new Error(
        `section is missing these keys: "${this.expectedKeys
          .filter(k => !(k in section))
          .join(', ')}"`,
      )
    }

    return isValid
  }

  get expectedKeys () {
    return ['id', 'selector', 'html']
  }

  get pushCartSections () {
    return [
      {
        id: 'push-cart-items',
        section: 'push-cart-items',
        selector: '.shopify-section',
      },
      {
        id: 'push-cart-addons',
        section: 'push-cart-addons',
        selector: '.shopify-section',
        convertor: (oldHTML, newHTML) => {
          const oldDOM = this.convertToDOM(oldHTML)
          const newDOM = this.convertToDOM(newHTML)

          const oldDrawerAccordion = oldDOM.querySelector('drawer-accordion')
          if (!oldDrawerAccordion) return newHTML

          const drawerIsOpen =
            oldDrawerAccordion.getAttribute('aria-expanded') === 'true'
          if (drawerIsOpen) {
            const newDrawer = newDOM.querySelector('drawer-accordion')
            if (!newDrawer) return newHTML

            newDrawer.setAttribute('aria-expanded', 'true')

            return newDOM.body.innerHTML
          }

          return newHTML
        },
      },
      {
        id: 'push-cart-footer',
        section: 'push-cart-footer',
        selector: '.shopify-section',
      },
      {
        id: 'push-cart-count',
        section: 'push-cart-count',
        selector: '.shopify-section',
        dontRender: true,
      },
      {
        id: 'push-cart-delivery',
        section: 'push-cart-delivery',
        selector: '.shopify-section',
      },
    ]
  }

  get cartSections () {
    return [
      {
        id: 'cart-items',
        section: 'cart-items',
        selector: '.shopify-section',
      },
      {
        id: 'cart-summary',
        section: 'cart-summary',
        selector: '.shopify-section',
      },
    ]
  }

  get sectionsUrl () {
    return `${window.location.pathname}${window.location.search}`
  }
})()
