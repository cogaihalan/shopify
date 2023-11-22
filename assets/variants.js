class VariantSelects extends HTMLElement {
  constructor () {
    super()
    this.init()
    this.addEventListener('change', this.onVariantChange)
  }

  init () {
    this.setOptionOneState()
    this.setOptionTwoState()
  }

  setOptionOneState () {
    const allVariants = this.getVariantData()
    const optionEls = [...this.querySelectorAll(this.optionSelector)]
    const selectedOptionTwo = optionEls.find(
      optionEl =>
        optionEl.dataset.index.includes('option2') &&
        optionEl.getAttribute('aria-pressed') === 'true',
    )

    const availableOptionValues = [
      ...new Set(
        allVariants
          .filter(variant => variant.available)
          .filter(variant =>
            selectedOptionTwo
              ? variant.option2 === selectedOptionTwo.dataset.value
              : variant,
          )
          .map(variant => {
            return variant.option1
          }),
      ),
    ]

    optionEls
      .filter(optionEl => optionEl.dataset.index.toString().includes('option1'))
      .forEach(optionEl => {
        if (!optionEl.dataset.value) return
        const isAvailable = availableOptionValues.find(
          value => value.toString() === optionEl.dataset.value.toString(),
        )
        optionEl.setAttribute('data-available', (!!isAvailable).toString())
      })
  }

  setOptionTwoState () {
    const allVariants = this.getVariantData()
    const optionEls = [...this.querySelectorAll(this.optionSelector)]
    const availableVariants = allVariants.filter(variant => variant.available)
    const selectedOptionOne = optionEls.find(
      optionEl =>
        optionEl.dataset.index.includes('option1') &&
        optionEl.getAttribute('aria-pressed') === 'true',
    )
    const selectedOptionTwo = optionEls.find(
      optionEl =>
        optionEl.dataset.index.includes('option2') &&
        optionEl.getAttribute('aria-pressed') === 'true',
    )

    const selectedOptions = {
      one: {
        element: selectedOptionOne,
        value: selectedOptionOne?.dataset?.value,
        availableVariants,
      },
      two: {
        element: selectedOptionTwo,
        value: selectedOptionTwo?.dataset?.value,
        availableVariants: availableVariants.filter(
          variant => variant?.option1 === selectedOptionOne?.dataset?.value,
        ),
      },
    }

    if (selectedOptions.two.value) {
      optionEls
        .filter(optionEl => {
          return String(optionEl.dataset.index) === `${this.productId}option2`
        })
        .forEach(optionEl => {
          const isAvailable = selectedOptions.two.availableVariants.find(
            variant => variant.option2 === String(optionEl.dataset.value),
          )
          optionEl.setAttribute('data-available', String(!!isAvailable))
        })
    }
  }

  onVariantChange (event) {
    this.updateOptions()
    this.updateMasterId()

    if (!this.currentVariant) {
      this.setAvailability()
    } else {
      this.dispatchChangeEvent(event)
      this.updateMedia()
      this.updateURL()
      this.updateVariantInput()
      this.renderProductInfo()
      this.setAvailability()
      this.updateCurrentSizeValue(event.target)
    }

    this.setOptionOneState()
    this.setOptionTwoState()
  }

  updateOptions () {
    this.options = Array.from(
      this.querySelectorAll('select'),
      select => select.value,
    )
  }

  updateMasterId () {
    this.currentVariant = this.getVariantData().find(variant => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option
        })
        .includes(false)
    })
  }

  updateCurrentSizeValue (target) {
    if (target.dataset.index?.indexOf('option1') === -1) return

    const sizeValueEl = document.querySelector(
      '[data-variant-selects-current-size]',
    )
    if (!sizeValueEl) return
    sizeValueEl.innerText = target.value
  }

  dispatchChangeEvent (event) {
    window.BAO.dispatchEvent(window.BAO.EVENTS.PRODUCT.VARIANT_CHANGED, {
      product: {
        id: this.productId,
      },
      variant: {
        id: this.currentVariant.id,
      },
      triggeredBy: event,
    })
  }

  updateMedia () {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`,
    )
    if (!newMedia) return
    const parent = newMedia.parentElement
    parent.prepend(newMedia)
    window.setTimeout(() => {
      parent.scroll(0, 0)
    })
  }

  updateURL () {
    if (!this.currentVariant || this.isQuickBuy || this.isBundleUpsell) return
    window.history.replaceState(
      {},
      '',
      `${this.dataset.url}?variant=${this.currentVariant.id}`,
    )
  }

  updateVariantInput () {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment`,
    )

    productForms.forEach(productForm => {
      const input = productForm.querySelector('input[name="id"]')
      input.value = this.currentVariant.id
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  renderProductInfo () {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`,
    )
      .then(response => response.text())
      .then(responseText => {
        const id = `price-${this.dataset.section}`
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id)
        const source = html.getElementById(id)

        if (source && destination) destination.innerHTML = source.innerHTML

        // eslint-disable-next-line no-unused-expressions
        document
          .getElementById(`price-${this.dataset.section}`)
          ?.classList.remove('visibility-hidden')
      })
  }

  setAvailability () {
    let addToBagSelector = '[data-product-add-to-cart]'
    if (this.isQuickBuy) {
      addToBagSelector = '[data-product-quick-buy-add-to-cart]'
    } else if (this.isBundleUpsell) {
      addToBagSelector = `[data-product-bundle-upsell-add-to-cart][data-product-id="${this.productId}"]`
    }

    const addToBagButtons = window.BAO.utils.getElements(addToBagSelector)

    let addToBagTextsSelector = '[data-product-add-to-cart-text]'
    if (this.isQuickBuy) {
      addToBagTextsSelector = '[data-product-quick-buy-add-to-cart-text]'
    }
    if (this.isBundleUpsell) {
      addToBagTextsSelector = `[data-product-bundle-upsell-add-to-cart-text][data-product-id="${this.productId}"]`
    }

    const addToBagTexts = window.BAO.utils.getElements(addToBagTextsSelector)

    let backInStockButtonsSelector = '[data-product-back-in-stock]'
    if (this.isQuickBuy) {
      backInStockButtonsSelector = '[data-product-quick-buy-back-in-stock]'
    }
    if (this.isBundleUpsell) {
      backInStockButtonsSelector = `[data-product-bundle-upsell-back-in-stock][data-product-id="${this.productId}"]`
    }

    const backInStockButtons = window.BAO.utils.getElements(
      backInStockButtonsSelector,
    )

    addToBagButtons.forEach(addToBagButton => {
      this.currentVariant && this.currentVariant.available
        ? (addToBagButton.disabled = false)
        : (addToBagButton.disabled = true)

      if (addToBagButton.dataset.backInStockEnabled !== 'true') return
      addToBagButton.setAttribute(
        'aria-hidden',
        (!this.currentVariant.available).toString(),
      )
    })

    backInStockButtons.forEach(backInStockButton => {
      this.currentVariant && this.currentVariant.available
        ? (backInStockButton.disabled = true)
        : (backInStockButton.disabled = false)

      backInStockButton.setAttribute(
        'data-variant-id',
        this.currentVariant.id.toString(),
      )
      backInStockButton.setAttribute(
        'aria-hidden',
        (this.currentVariant && this.currentVariant.available).toString(),
      )
    })

    const wishlistButtons = window.BAO.utils.getElements(
      '[data-product-wishlist-button]',
    )

    addToBagTexts.forEach(addToBagText => {
      addToBagText.textContent = this.currentVariant.available
        ? addToBagText.dataset.enablePreOrders &&
          addToBagText.dataset.enablePreOrders === 'true'
          ? window.variantStrings.preOrder
          : window.variantStrings.addToCart
        : window.variantStrings.unavailable
    })

    if (backInStockButtons) {
      backInStockButtons.forEach(backInStockButtons => {
        backInStockButtons.setAttribute(
          'aria-hidden',
          this.currentVariant.available,
        )
        backInStockButtons.setAttribute(
          'data-variant-id',
          this.currentVariant.id,
        )
      })
    }

    if (wishlistButtons) {
      wishlistButtons.forEach(wishlistButton => {
        wishlistButton.setAttribute('data-variant-id', this.currentVariant.id)
      })
    }
  }

  getVariantData () {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent)
    return this.variantData
  }

  get optionSelector () {
    return '[data-variant-selects-option]'
  }

  get isBundleUpsell () {
    return (
      this.dataset.section && this.dataset.section === 'product-bundle-upsell'
    )
  }

  get isQuickBuy () {
    return this.dataset.section && this.dataset.section === 'product-quickbuy'
  }

  get productId () {
    return this.dataset.productId ? parseInt(this.dataset.productId) : null
  }
}

customElements.define('variant-selects', VariantSelects)

class VariantRadios extends VariantSelects {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    super()
  }

  updateOptions () {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'))
    this.options = fieldsets.map(fieldset => {
      return Array.from(fieldset.querySelectorAll('input')).find(
        radio => radio.checked,
      ).value
    })
  }
}

customElements.define('variant-radios', VariantRadios)
