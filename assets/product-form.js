class PushCartError {
  static async handle (error, item, element) {
    const instance = new this(error, element)

    if (instance.soldOut) {
      return instance.render(instance.MESSAGES.SOLD_OUT())
    } else if (instance.alreadyHaveAllInCart) {
      return instance.render(instance.MESSAGES.ALREADY_HAVE_ALL_STOCK())
    } else if (instance.addedMoreThanExists) {
      const newItem = Object.assign({}, item, {
        quantity: instance.allowedQuantity,
      })

      await element.addToCart(newItem)

      instance.render(instance.MESSAGES.NOT_ENOUGH_IN_STOCK())
    } else if (instance.cannotFindVariant) {
      return instance.render(instance.MESSAGES.CANNOT_FIND_VARIANT())
    } else {
      const newItem = Object.assign({}, item, {
        quantity: instance.allowedQuantity,
      })

      await element.addToCart(newItem)

      instance.render(
        instance.MESSAGES.ADD_TOO_MANY(item.quantity, instance.allowedQuantity),
      )
    }

    return instance
  }

  constructor (error, element) {
    this.description = error.description
    this.status = error.status

    this.element = element

    this.description = ''
    this.status = null

    this.MESSAGES = {
      ADD_TOO_MANY: (wantedQuantity, allowedQuantity) =>
        `Unfortunately there isn't ${wantedQuantity} ${this.productName}'s left. We've added ${allowedQuantity} to the cart instead.`,
      ALREADY_HAVE_ALL_STOCK: () =>
        `You already have all of the remaining "${this.productName}" in your cart`,
      NOT_ENOUGH_IN_STOCK: () =>
        `Unfortunately, there isn't enough of "${this.productName}" available. We've added ${this.allowedQuantity} to your cart instead.`,
      SOLD_OUT: () => `Unfortunately, "${this.productName}" is sold out.`,
      CANNOT_FIND_VARIANT: () =>
        'There was an error adding this product to cart.',
    }
  }

  render (message) {
    alert('TODO')
  }

  get addedMoreThanExists () {
    return this.description.slice(0, 18) === "You can't add more"
  }

  get alreadyHaveAllInCart () {
    return this.description.slice(0, 4) === 'All '
  }

  get allowedQuantity () {
    return 1
  }

  get soldOut () {
    return this.description.slice(0, 13) === "The product '"
  }

  get cannotFindVariant () {
    return this.description.toLowerCase() === 'cannot find variant'
  }

  get productName () {
    const strSplitWithoutStart = this.soldOut
      ? this.description.split("'")[1]
      : this.alreadyHaveAllInCart
        ? this.description
          .split(' ')
          .slice(2)
          .join(' ')
        : this.description
          .split(' ')
          .slice(4)
          .join(' ')

    return strSplitWithoutStart.replace(' to the cart.', '')
  }
}

class ProductForm extends HTMLElement {
  constructor () {
    super()
    this.form = this.querySelector('form')
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this))

    this.wishlistButtonEl = this.querySelector(
      '[data-product-form-wishlist-el]',
    )
    if (this.wishlistButtonEl) {
      if (
        this.checkIfVariantIsInWishlist(
          Number(this.wishlistButtonEl.dataset.variantId),
        )
      ) {
        this.wishlistButtonEl.setAttribute('data-wishlist-status', 'added')
      }

      this.wishlistButtonEl.addEventListener('click', e =>
        this.handleWishlistItemSubmission(this.wishlistButtonEl),
      )
    }

    window.BAO.eventBus.addEventListener(
      window.BAO.EVENTS.PRODUCT.VARIANT_CHANGED,
      e => {
        if (!this.wishlistButtonEl) return
        if (this.checkIfVariantIsInWishlist(e.detail.variant.id)) {
          this.wishlistButtonEl.setAttribute('data-wishlist-status', 'added')
        } else {
          this.wishlistButtonEl.removeAttribute('data-wishlist-status')
        }
      },
    )

    if (this.querySelector('[data-product-form-el="quantity"]')) {
      this.querySelector('[data-product-form-el="quantity"]').addEventListener(
        'change',
        e => {
          this.querySelector(
            '[data-product-form-el="quantityHiddenInput"]',
          ).value = e.target.value
        },
      )
    }
  }

  checkIfVariantIsInWishlist (variantId) {
    const locallyStoredWishlistList = JSON.parse(
      window.localStorage.getItem('swym-products'),
    )
    if (locallyStoredWishlistList.all.find(item => item.epi === variantId)) {
      return true
    }
    return false
  }

  async onSubmitHandler (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const id = Number(formData.get('id'))
    const quantity = Number(formData.get('quantity'))
    const properties = buildProperties(formData)

    await this.addToCart({ id, quantity, properties })
  }

  async addToCart (item) {
    try {
      return window.BAO.Cart.addItem(
        {
          id: item.id,
          quantity: item.quantity,
          properties: item.properties,
        },
        this.form,
        {
          sections: window.BAO.utils.sectionRenderer.pushCartSections.map(
            s => s.section,
          ),
        },
      )
    } catch (err) {
      return this.handleAddToCartError(err, item)
    }
  }

  async handleAddToCartError (err, item) {
    return PushCartError.handle(await err.json(), item, this)
  }

  handleWishlistItemSubmission (target) {
    if (!target || !window._swat) return

    const data = {
      epi: Number(target.dataset.variantId),
      du: `${target.dataset.productUrl}`,
      empi: Number(target.dataset.productId),
    }

    if (this.checkIfVariantIsInWishlist(Number(target.dataset.variantId))) {
      window._swat.removeFromWishList(data, () => {
        target.removeAttribute('data-wishlist-status')
        window.BAO.dispatchEvent(window.BAO.EVENTS.WISHLIST.UPDATED)
      })
    } else {
      window._swat.addToWishList(data, () => {
        target.setAttribute('data-wishlist-status', 'added')
        window.BAO.dispatchEvent(window.BAO.EVENTS.WISHLIST.UPDATED)
      })
    }
  }
}

customElements.define('product-form', ProductForm)

function buildProperties (formData) {
  const propertyKeyValues = [...formData.entries()].filter(
    ([key, value]) => key.includes('properties[') && value !== '',
  )

  function propertyReducer (properties, [key, value]) {
    const strippedKey = key.replace('properties[', '').slice(0, -1)

    return {
      ...properties,
      [strippedKey]: value,
    }
  }

  return propertyKeyValues.reduce(propertyReducer, {})
}
