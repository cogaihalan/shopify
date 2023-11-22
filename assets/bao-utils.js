window.BAO = window.BAO || {}
window.BAO.utils = window.BAO.utils || {}

/**
 * Returns the first element that is a descendant of node that
 * matches selectors.
 *
 * @param {String} selector - A DOMString containing one or more selectors to match. This string
 *   must be a valid CSS selector string
 * @param {Object} [config] - You can pass a context to scope the element selection
 * @param {HTMLElement|Document} [context=Document] - The scope we will try and find the element in
 *
 * @returns {HTMLElement} The found element or null
 */
function getElement (selector, { context = document } = {}) {
  return context.querySelector(selector)
}

/**
 * Returns a list of elements that are a descendant of node that
 * matches selectors.
 *
 * @param {String} selector - A DOMString containing one or more selectors to match. This string
 *   must be a valid CSS selector string
 * @param {Object} [config] - You can pass a context to scope the element selection
 * @param {HTMLElement|Document} [context=Document] - The scope we will try and find the element in
 * @param {Boolean} [asArray=true] - Return the elements as an Array instead of an NodeList?
 *
 * @returns {Array|NodeList} The found elements or null
 */
function getElements (selector, { context = document, asArray = true } = {}) {
  const items = context.querySelectorAll(selector)

  return asArray ? Array.from(items) : items
}

/**
 * Checks if the passed string contains any items in an array
 *
 * @param {String} str - The string we will be searching
 * @param {Array} [items] - A list of the items we will be checking for presence in the str
 *
 * @returns {Boolean}
 */
function doesStringContainAny (str, items = []) {
  return items.some(i => str.includes(i))
}

/**
 * Creates an HTMLElement
 *
 * @param {String} tag - What type of element we want this to be
 * @param {Object} [options] - A key / value pair of properties and values we want to set on the
 *   newly created element
 *
 * @returns {HTMLElement}
 */
function createElement (tag, options = {}) {
  const el = document.createElement(tag)

  Object.entries(options).forEach(([key, value]) => {
    el.setAttribute(key, value)
  })

  return el
}

/**
 * Creates an array starting from zero with the length of the passed amount
 *
 * @param {Number} amount - How long do we want this array to be?
 *
 * @returns {Array}
 */
function range (amount) {
  return [...Array(amount).keys()]
}

/**
 * camelCase a string
 *
 * @param {String} str
 *
 * @return {String} value - formatted value
 */
function camelize (str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

/**
 * A Javascript equivalent of Shopify's | img_url filter
 *
 * @param {Object} The properties we will use to create the URL
 * @param {String} src - The Shopify CDN URL of the image
 * @param {String} size - What size we want the image to be
 * @param {null|String} [crop=null] - By default the images aren't cropped but we can choose to
 *   crop them
 * @param {null|Number} [scale=null] - Images are 1x by default, you can choose to pass a different
 *   scale
 *
 * @returns {String}
 */
function resizeImage ({ src, size, crop = null, scale = null } = {}) {
  if (size == null) {
    return src
  }

  if (size === 'master') {
    return src.replace(/http(s)?:/, '')
  }

  const match = src.match(
    /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif|webp)(\?v=\d+)?/i,
  )

  if (match != null) {
    const prefix = src.split(match[0])
    const suffix = match[0]
    const scaleString = scale ? `@${scale}x` : ''
    const cropString = crop ? `_crop_${crop}` : ''

    return `${prefix[0]}_${size}${cropString}${scaleString}${suffix}`.replace(
      /http(s)?:/,
      '',
    )
  } else {
    return null
  }
}

/**
 * This is the default config we will use when using fetch()
 *
 * @returns {Object}
 */
function getDefaultRequestConfig () {
  return {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
}

/**
 * Default fetch boilerplate
 * @param {String} url - The URL we are looking to fetch
 * @param {Object} [config] - .fetch config to override the default
 *
 * @returns {Promise}
 */
function fetchJSON (url, config = {}) {
  return fetch(url, Object.assign({}, getDefaultRequestConfig(), config)).then(
    response => {
      if (!response.ok) {
        throw response
      }
      return response.json()
    },
  )
}

/**
 * This will fetch product data from Shopify's AJAX API by handle
 *
 * @param {String} handle - The products handle
 *
 * @returns {Promise}
 */
function fetchProductData (handle) {
  try {
    return fetchJSON(`/products/${handle}.js`)
  } catch (e) {
    console.error(e)
  }
}

/**
 * Gets the offsetTop of the passed element relevant to it's offsetParent
 *
 * @param {HTMLElement|Element} el - The element we'll be getting the offsetTop for
 * @param {Document|HTMLElement} [parent=HTMLBodyElement] - The offsetParent we want to get the offsetTop relative to
 * @param {Number} [offsetTop=0] - The starting offsetTop. This tends to be 0 but given this is a
 *   recursive function, we need to pass it to let it build up
 *
 * @returns {Number}
 */
function getOffsetTop (el, parent = document.body, offsetTop = 0) {
  if (!isNaN(el.offsetTop)) {
    offsetTop += el.offsetTop
  }

  return el.offsetParent === parent
    ? offsetTop
    : getOffsetTop(el.offsetParent, parent, offsetTop)
}

/** Gets the offsetLeft of the passed element relevant to it's offsetParent
 *
 * @param {HTMLElement|Element} el - The element we'll be getting the offsetLeft for
 * @param {Document|HTMLElement} [parent=HTMLBodyElement] - The offsetParent we want to get the
 *   offsetLeft relative to
 * @param {Number} [offsetLeft=0] - The starting offsetLeft. This tends to be 0 but given this is a
 *   recursive function, we need to pass it to let it build up
 *
 * @returns {Number}
 */
function getOffsetLeft (el, parent = document.body, offsetLeft = 0) {
  if (!isNaN(el.offsetLeft)) {
    offsetLeft += el.offsetLeft
  }

  return el.offsetParent === parent
    ? offsetLeft
    : getOffsetLeft(el.offsetParent, parent, offsetLeft)
}

/**
 * Format money values based on your shop currency settings
 * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
 * or 3.00 dollars
 * @param  {String} [format] - shop money_format setting
 *
 * @return {String} value - formatted value
 */
function formatMoney (cents, format = window.theme.moneyFormat) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '')
  }
  let value = ''
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
  const formatString = format

  function formatWithDelimiters (
    number,
    precision = 2,
    thousands = ',',
    decimal = '.',
  ) {
    if (isNaN(number) || number == null) {
      return 0
    }

    number = (number / 100.0).toFixed(precision)

    const parts = number.split('.')
    const dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`,
    )
    const centsAmount = parts[1] ? decimal + parts[1] : ''

    return dollarsAmount + centsAmount
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2)
      break
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0)
      break
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',')
      break
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',')
      break
  }

  return formatString.replace(placeholderRegex, value)
}

function getOrdinalForDay (day) {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

/**
 * Inject variables into a translated string.
 *
 * @param {string} translation
 * @param {{ [variable: string]: any }} variables
 * @param {{ delimiters?: [string, string][] }} [options]
 *
 * @example
 * // returns Hurry! Only 2 left in stock.
 * translateString('Hurry! Only {{ count }} left in stock.', { count: 2 })
 */
function translateString (
  translation,
  variables,
  options = {
    delimiters: [
      ['{{\\s*', '\\s*}}'],
      ['%{', '}'],
    ],
  },
) {
  return Object.entries(variables).reduce((baseTranslation, [key, value]) => {
    const replacePattern = options.delimiters
      .map(([start, end]) => `${start}${key}${end}`)
      .join('|')

    return baseTranslation.replace(new RegExp(replacePattern, 'g'), value)
  }, translation)
}

/**
 * @param {Function} fn
 * @param {number} wait
 *
 * @return {Function}
 */
function debounce (fn, wait) {
  let t

  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}

/**
 * @param {FormData} formData
 *
 * @return {Object}
 */
function buildProperties (formData) {
  const propertyKeyValues = [...formData.entries()].filter(
    ([key, value]) => key.includes('properties[') && value !== '',
  )

  /**
   * @param {Object} properties
   * @param {[string, string]} property
   *
   * @returns {Object}
   */
  function propertyReducer (properties, [key, value]) {
    const strippedKey = key.replace('properties[', '').slice(0, -1)

    return {
      ...properties,
      [strippedKey]: value,
    }
  }

  return propertyKeyValues.reduce(
    (properties, property) => propertyReducer(properties, property),
    {},
  )
}

function isInViewport (element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Checks if a child is inside a parent
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 * @param {number} levelsDeep By default 3 - How many levels do you want to check?
 *
 * @returns {Boolean}
 */
function isChild (child, parent, levelsDeep = 3) {
  let node = child.parentNode
  let count = 0

  while (node) {
    if (node === parent) {
      return true
    }

    if (levelsDeep === count || child === parent) {
      return false
    }

    count++
    node = node.parentNode
  }

  return false
}

Object.assign(window.BAO.utils, {
  buildProperties,
  camelize,
  createElement,
  debounce,
  doesStringContainAny,
  fetchJSON,
  fetchProductData,
  formatMoney,
  getDefaultRequestConfig,
  getElement,
  getElements,
  getOffsetTop,
  getOffsetLeft,
  getOrdinalForDay,
  isInViewport,
  isChild,
  range,
  resizeImage,
  translateString,
})
