/** @const {String} The context in which we want the sections to be rendered in */
const DEFAULT_SECTIONS_URL = window.location.pathname

/**
 * An item we are going to add to the cart
 * @typedef {Object} PotentialCartItem
 *
 * @property {number} id The variant's unique ID
 * @property {number} quantity The quantity of items to be added to the cart
 * @property {object} properties Line item property key/values
 */

/**
 * By Association Only's cart helper methods
 */
class BaoCart {
  /**
   * Add a new line item to the cart
   * @param {PotentialCartItem} item The item we want to add values to pass to /cart/add.js
   * @param {HTMLFormElement} form The form that has added the item
   * @param {object} options Optional values to pass to /cart/add.js
   * @param {string[]} [options.sections] - The sections we want rendered alongside any cart
   *   changes
   * @param {string} [options.sectionsUrl] - The context in which we want the sections to be
   *   rendered in
   * @param {object} [options.attributes] Key/values that we want to add to the cart attributes
   *
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js
   *   https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  async addItem (
    { id, quantity = 1, properties = {} },
    form,
    {
      sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
        s => s.section,
      ),
      sectionsUrl = DEFAULT_SECTIONS_URL,
      attributes = {},
    },
  ) {
    let item = {
      id,
      quantity,
      properties,
    }

    item = this.addVatRateToItem(item)

    window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.BEFORE_ADD, {
      item,
      attributes,
      form,
    })

    const body = {
      items: [item],
      attributes,
    }

    if (sections.length) {
      body.sections = sections
      body.sections_url = sectionsUrl
    }

    try {
      const state = await this.cartAdd(body)

      window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.AFTER_ADD, {
        item,
        state,
        form,
      })

      window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.CHANGED, {
        state,
      })

      return state
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Add a new line item to the cart
   * @param {PotentialCartItem[]} items
   * @param {object} options Optional values to pass to /cart/add.js
   *   (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @param {string[]} [options.sections] - The sections we want rendered alongside any cart
   *   changes
   * @param {string} [options.sectionsUrl] - The context in which we want the sections to be
   *   rendered in
   *
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js
   *   https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  async addItems (
    items,
    {
      sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
        s => s.section,
      ),
      sectionsUrl = DEFAULT_SECTIONS_URL,
    } = {},
  ) {
    window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.BEFORE_MULTIPLE_ADD, {
      items,
    })

    items = items.map(item => this.addVatRateToItem(item))

    const body = {
      items,
    }

    if (sections.length) {
      body.sections = sections
      body.sections_url = sectionsUrl
    }

    try {
      const state = await this.cartAdd(body)

      window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.AFTER_MULTIPLE_ADD, {
        state,
      })
      window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.CHANGED, {
        state,
      })

      return state
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Updates the quantity of an item in the cart. You can set the quantity to 0 to remove the item
   *
   * @param {string} key - The key of the line item we want to change
   * @param {number} quantity - The amount of the item we want change the line item to. Can be 0.
   * @param {string[]} [sections] - The sections we want rendered alongside any cart changes
   * @param {string} [sectionsUrl] - The context in which we want the sections to be rendered in
   *
   * @returns {Promise<object>}
   */
  async updateQuantity (
    key,
    quantity,
    sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
      s => s.section,
    ),
    sectionsUrl = DEFAULT_SECTIONS_URL,
  ) {
    window.BAO.dispatchEvent(
      window.BAO.EVENTS.PUSH_CART.BEFORE_UPDATE_ITEM_QUANTITY,
      {
        key,
        quantity,
      },
    )
    const body = {
      id: key,
      quantity,
    }

    if (sections.length) {
      body.sections = sections
      body.sections_url = sectionsUrl
    }

    try {
      const state = await this.cartChange(body)

      window.BAO.dispatchEvent(
        window.BAO.EVENTS.PUSH_CART.AFTER_UPDATE_ITEM_QUANTITY,
        {
          state,
        },
      )

      window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.CHANGED, {
        state,
      })

      return state
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Remove an item from the cart
   *
   * @param {string} key - The key of the line item we want to change
   * @param {string[]} [sections] - The sections we want rendered alongside any cart changes
   * @param {string} [sectionsUrl] - The context in which we want the sections to be rendered in
   *
   * @returns {Promise}
   */
  async removeItem (
    key,
    sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
      s => s.section,
    ),
    sectionsUrl = window.location.pathname,
  ) {
    window.BAO.dispatchEvent(
      window.BAO.EVENTS.PUSH_CART.BEFORE_UPDATE_REMOVE_ITEM,
      { key },
    )
    const body = {
      id: key,
      quantity: 0,
    }

    if (sections.length) {
      body.sections = sections
      body.sections_url = sectionsUrl
    }

    try {
      const state = await this.cartChange(body)

      window.BAO.dispatchEvent(
        window.BAO.EVENTS.PUSH_CART.AFTER_UPDATE_REMOVE_ITEM,
        {
          state,
        },
      )

      window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.CHANGED, {
        state,
      })

      return state
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Removes multiple items from the cart
   *
   * @param {string[]} keys - The key of the line item we want to change
   * @param {string[]} [sections] - The sections we want rendered alongside any cart changes
   * @param {string} [sectionsUrl] - The context in which we want the sections to be rendered in
   *
   * @returns {Promise}
   */
  async removeItems (
    keys,
    sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
      s => s.section,
    ),
    sectionsUrl = window.location.pathname,
  ) {
    window.BAO.dispatchEvent(
      window.BAO.EVENTS.PUSH_CART.BEFORE_UPDATE_REMOVE_ITEM,
      { keys },
    )

    while (keys.length > 0) {
      const key = keys.shift()
      const isLastKey = keys.length === 0
      const body = {
        id: key,
        quantity: 0,
      }

      if (isLastKey && sections.length) {
        body.sections = sections
        body.sections_url = sectionsUrl
      }

      try {
        const state = await this.cartChange(body)

        if (isLastKey) {
          window.BAO.dispatchEvent(
            window.BAO.EVENTS.PUSH_CART.AFTER_UPDATE_REMOVE_ITEM,
            {
              state,
            },
          )

          window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.CHANGED, {
            state,
          })

          return state
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  /**
   * Update line item properties
   *
   * https://shopify.dev/api/ajax/reference/cart#update-properties
   *
   * @param {string} key - The key of the line item we want to change
   * @param {object} properties - An object of key/value pairs you want to update
   * @param {string[]} [sections] - The sections we want rendered alongside any cart changes
   * @param {string} [sectionsUrl] - The context in which we want the sections to be rendered
   *
   * @returns {Promise}
   */
  async updateItemProperties (
    key,
    properties,
    sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
      s => s.section,
    ),
    sectionsUrl = window.location.pathname,
  ) {
    const body = { id: key, properties }

    if (sections.length) {
      body.sections = sections
      body.sections_url = sectionsUrl
    }

    try {
      return this.cartChange(body)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Update cart attributes
   *
   * https://shopify.dev/api/ajax/reference/cart#update-cart-attributes
   *
   * @param {object} attributes - An object of key/value pairs you want to update
   * @param {string[]} [sections] - The sections we want rendered alongside any cart changes
   * @param {string} [sectionsUrl] - The context in which we want the sections to be rendered
   *
   * @returns {Promise}
   */
  async updateCartAttributes (
    attributes,
    sections = window.BAO.utils.sectionRenderer.pushCartSections.map(
      s => s.section,
    ),
    sectionsUrl = window.location.pathname,
  ) {
    window.BAO.dispatchEvent(
      window.BAO.EVENTS.PUSH_CART.BEFORE_UPDATE_CART_ATTRIBUTES,
      {
        attributes,
      },
    )

    const body = { attributes }

    if (sections.length) {
      body.sections = sections
      body.sections_url = sectionsUrl
    }

    try {
      const state = await this.cartUpdate(body)

      window.BAO.dispatchEvent(
        window.BAO.EVENTS.PUSH_CART.AFTER_UPDATE_CART_ATTRIBUTES,
        {
          attributes,
        },
      )

      window.BAO.dispatchEvent(window.BAO.EVENTS.PUSH_CART.CHANGED, {
        state,
      })

      return state
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @param {object} body - An object of key/value pairs you want to update
   *
   * @returns {Promise}
   */
  cartAdd (body) {
    return window.BAO.utils.fetchJSON(`${window.routes.cartAddUrl}`, {
      ...window.BAO.utils.getDefaultRequestConfig(),
      ...{ body: JSON.stringify(body) },
    })
  }

  /**
   * @param {object} body - An object of key/value pairs you want to update
   *
   * @returns {Promise}
   */
  cartChange (body) {
    return window.BAO.utils.fetchJSON(`${window.routes.cartChangeUrl}`, {
      ...window.BAO.utils.getDefaultRequestConfig(),
      ...{ body: JSON.stringify(body) },
    })
  }

  /**
   * @param {object} body - An object of key/value pairs you want to update
   *
   * @returns {Promise}
   */
  cartUpdate (body) {
    return window.BAO.utils.fetchJSON(`${window.routes.cartUpdateUrl}`, {
      ...window.BAO.utils.getDefaultRequestConfig(),
      ...{ body: JSON.stringify(body) },
    })
  }

  /**
   * @param {PotentialCartItem} item
   *
   * @returns {PotentialCartItem}
   */
  addVatRateToItem (item) {
    if (!('properties' in item)) return item
    if ('_vat_rate' in item.properties) return item

    item.properties._vat_rate = window.theme.defaultVatRate

    return item
  }
}

window.BAO.Cart = new BaoCart()
