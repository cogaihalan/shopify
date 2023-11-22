let fields = {
  description: document.querySelector('#checkout_shipping_address_address1'),
  street: document.querySelector('#checkout_shipping_address_address2'),
  city: document.querySelector('#checkout_shipping_address_city'),
  county: document.querySelector('#checkout_shipping_address_province'),
  postcode: document.querySelector('#checkout_shipping_address_zip'),
  country: document.querySelector('#checkout_shipping_address_country'),
}
let cart

let shippingInfoContainer = document.querySelector('[data-shipping-address]')

function initialiseClickAndCollect () {
  shippingInfoContainer = document.querySelector('[data-shipping-address]')
  fields = {
    description: document.querySelector('#checkout_shipping_address_address1'),
    street: document.querySelector('#checkout_shipping_address_address2'),
    city: document.querySelector('#checkout_shipping_address_city'),
    county: document.querySelector('#checkout_shipping_address_province'),
    postcode: document.querySelector('#checkout_shipping_address_zip'),
    country: document.querySelector('#checkout_shipping_address_country'),
  }
  const currentClickAndCollectEl = document.querySelector(
    '.chk-ClickAndCollect_Inner',
  )
  if (!shippingInfoContainer || currentClickAndCollectEl) return

  document.querySelector('body').appendChild(getClickAndCollectModal())
  shippingInfoContainer.prepend(getShippingSelectorHtml())

  setFormVisibility(false)
  checkCartAttributes()
}

function setFormVisibility (showForm) {
  const displayValue = showForm ? 'block' : 'none'

  shippingInfoContainer.querySelector(
    '.section__header',
  ).style.display = displayValue
  shippingInfoContainer.querySelector(
    '.section__content',
  ).style.display = displayValue
  document.querySelector(
    '.step__footer__continue-btn',
  ).style.display = displayValue
}

function getShippingSelectorHtml () {
  const shippingSelector = document.createElement('div')

  const dynamicCheckoutInner = getDynamicCheckoutInner()

  dynamicCheckoutInner.append(
    getClickAndCollectElement(),
    getHomeDeliveryElement(),
  )

  shippingSelector.append(getDynamicCheckoutTitle(), dynamicCheckoutInner)

  return shippingSelector
}

async function checkCartAttributes () {
  cart = await fetch('/cart.js').then(response => {
    if (!response.ok) {
      throw response
    }

    return response.json()
  })

  if (cart && cart.attributes && cart.attributes.externalId) {
    formatForm(true, false)
    localStorage.storeId = cart.attributes.externalId
  } else if (window.localStorage.storeId) {
    formatForm(true, false)
    setStoreId(window.localStorage.storeId)
  } else if (window.localStorage.storeId === '') {
    formatForm(false, false)
  }
}

function initClickAndCollectModal (e) {
  const clickAndCollectModal = document.querySelector(
    '.chk-ClickAndCollect_Modal',
  )

  if (!clickAndCollectModal.hasAttribute('initialised')) {
    window.loadParcelshopFinder({
      infoPane: true,
      selectable: true,
      search: true,
      directDelivery: true,
      containerElement: '[click-and-collect-hermes]',
    })
    clickAndCollectModal.setAttribute('initialised', '')
  }

  clickAndCollectModal.setAttribute('aria-hidden', 'false')
}

function getClickAndCollectModal () {
  const clickAndCollectModal = document.createElement('div')
  clickAndCollectModal.classList.add('chk-ClickAndCollect_Modal')
  clickAndCollectModal.setAttribute('aria-hidden', 'true')

  const clickAndCollectModalContainer = document.createElement('div')
  clickAndCollectModalContainer.classList.add(
    'chk-ClickAndCollect_ModalContainer',
  )
  clickAndCollectModalContainer.setAttribute('click-and-collect-hermes', '')

  clickAndCollectModal.appendChild(clickAndCollectModalContainer)

  clickAndCollectModal.addEventListener('click', () => {
    const modalIsVisible =
      clickAndCollectModal.getAttribute('aria-hidden') === 'true'
    clickAndCollectModal.setAttribute('aria-hidden', !modalIsVisible)
  })

  return clickAndCollectModal
}

function getClickAndCollectElement () {
  const containerEl = document.createElement('div')
  containerEl.className = 'chk-ClickAndCollect_Container ClickAndCollect'

  const radioContainerEl = document.createElement('div')
  radioContainerEl.className = 'chk-ClickAndCollect_RadioContainer'

  const infoContainerEl = document.createElement('div')
  infoContainerEl.className = 'chk-ClickAndCollect_InfoContainer'

  const infoTitleEl = document.createElement('h2')
  infoTitleEl.className = 'chk-ClickAndCollect_InfoTitle'
  infoTitleEl.innerHTML = window.cartStrings.clickAndCollect.click_and_collect

  const infoPricesEl = document.createElement('div')
  infoPricesEl.className = 'chk-ClickAndCollect_InfoPrices'

  const infoPriceEl1 = document.createElement('div')
  infoPriceEl1.className = 'chk-ClickAndCollect_InfoPrice'
  infoPriceEl1.innerHTML =
    window.cartStrings.clickAndCollect.click_and_collect_next_day

  const infoPriceEl2 = document.createElement('div')
  infoPriceEl2.className = 'chk-ClickAndCollect_InfoPrice'
  infoPriceEl2.innerHTML =
    window.cartStrings.clickAndCollect.click_and_collect_standard

  infoPricesEl.append(infoPriceEl1)
  infoPricesEl.append(infoPriceEl2)

  const infoUSPEl = document.createElement('div')
  infoUSPEl.className = 'chk-ClickAndCollect_InfoUSPs'

  const infoPriceUSP1 = document.createElement('div')
  infoPriceUSP1.className = 'chk-ClickAndCollect_InfoUSP'
  if (window.eco_leaf_image_url) {
    const ecoLeafIcon = getEcoLeafIcon()
    infoPriceUSP1.append(ecoLeafIcon)
  }
  const infoPriceUSP1Title = document.createElement('div')
  infoPriceUSP1Title.innerHTML =
    window.cartStrings.clickAndCollect.click_and_collect_USP1
  infoPriceUSP1.append(infoPriceUSP1Title)

  const infoPriceUSP2 = document.createElement('div')
  infoPriceUSP2.className = 'chk-ClickAndCollect_InfoUSP'
  if (window.van_icon_image_url) {
    const vanIcon = getVanIcon()
    infoPriceUSP2.append(vanIcon)
  }
  const infoPriceUSP2Title = document.createElement('div')
  infoPriceUSP2Title.innerHTML =
    window.cartStrings.clickAndCollect.click_and_collect_USP2
  infoPriceUSP2.append(infoPriceUSP2Title)

  const infoPriceUSP3 = document.createElement('div')
  infoPriceUSP3.className = 'chk-ClickAndCollect_InfoUSP'
  if (window.cost_effective_image_url) {
    const costEffectiveIcon = getCostEffectiveIcon()
    infoPriceUSP3.append(costEffectiveIcon)
  }
  const infoPriceUSP3Title = document.createElement('div')
  infoPriceUSP3Title.innerHTML =
    window.cartStrings.clickAndCollect.click_and_collect_USP3
  infoPriceUSP3.append(infoPriceUSP3Title)

  infoUSPEl.append(infoPriceUSP1)
  infoUSPEl.append(infoPriceUSP2)
  infoUSPEl.append(infoPriceUSP3)

  const infoFooterEl = document.createElement('div')
  infoFooterEl.className = 'chk-ClickAndCollect_InfoFooter'
  infoFooterEl.innerHTML =
    window.cartStrings.clickAndCollect.click_and_collect_footer

  infoContainerEl.append(infoTitleEl)
  infoContainerEl.append(infoPricesEl)
  infoContainerEl.append(infoUSPEl)
  infoContainerEl.append(infoFooterEl)

  containerEl.append(radioContainerEl)
  containerEl.append(infoContainerEl)

  containerEl.addEventListener('click', initClickAndCollectModal)

  return containerEl
}

function getHomeDeliveryElement () {
  const containerEl = document.createElement('div')
  containerEl.className = 'chk-ClickAndCollect_Container HomeDelivery'

  const radioContainerEl = document.createElement('div')
  radioContainerEl.className = 'chk-ClickAndCollect_RadioContainer'

  const infoContainerEl = document.createElement('div')
  infoContainerEl.className = 'chk-ClickAndCollect_InfoContainer'

  const infoTitleEl = document.createElement('h2')
  infoTitleEl.className = 'chk-ClickAndCollect_InfoTitle'
  infoTitleEl.innerHTML = window.cartStrings.clickAndCollect.home_delivery

  const infoPricesEl = document.createElement('div')
  infoPricesEl.className = 'chk-ClickAndCollect_InfoPrices'

  const infoPriceEl1 = document.createElement('div')
  infoPriceEl1.className = 'chk-ClickAndCollect_InfoPrice'
  infoPriceEl1.innerHTML =
    window.cartStrings.clickAndCollect.home_delivery_next_day

  const infoPriceEl2 = document.createElement('div')
  infoPriceEl2.className = 'chk-ClickAndCollect_InfoPrice'
  infoPriceEl2.innerHTML =
    window.cartStrings.clickAndCollect.home_delivery_standard

  infoPricesEl.append(infoPriceEl1)
  infoPricesEl.append(infoPriceEl2)

  infoContainerEl.append(infoTitleEl)
  infoContainerEl.append(infoPricesEl)

  containerEl.append(radioContainerEl)
  containerEl.append(infoContainerEl)

  containerEl.addEventListener('click', () => {
    setStoreId('')
    formatForm(false, true)
    shippingInfoContainer.querySelector('.section__header').style.display =
      'block'
    shippingInfoContainer.querySelector('.section__content').style.display =
      'block'
    document.querySelector('.step__footer__continue-btn').style.display =
      'block'
    toggleShopPay('show')
  })

  return containerEl
}

function getEcoLeafIcon () {
  const dynamicCheckoutContentImage = document.createElement('img')

  dynamicCheckoutContentImage.src = window.eco_leaf_image_url
  dynamicCheckoutContentImage.classList.add('chk-ClickAndCollect_IntroImage')

  return dynamicCheckoutContentImage
}

function getVanIcon () {
  const dynamicCheckoutContentImage = document.createElement('img')

  dynamicCheckoutContentImage.src = window.van_icon_image_url
  dynamicCheckoutContentImage.classList.add('chk-ClickAndCollect_IntroImage')

  return dynamicCheckoutContentImage
}

function getCostEffectiveIcon () {
  const dynamicCheckoutContentImage = document.createElement('img')

  dynamicCheckoutContentImage.src = window.cost_effective_image_url
  dynamicCheckoutContentImage.classList.add('chk-ClickAndCollect_IntroImage')

  return dynamicCheckoutContentImage
}

function getDynamicCheckoutTitle () {
  const dynamicCheckoutTitle = document.createElement('h2')

  dynamicCheckoutTitle.innerHTML =
    window.cartStrings.clickAndCollect.dynamic_checkout_title
  dynamicCheckoutTitle.className =
    'section__title layout-flex__item layout-flex__item--stretch'

  return dynamicCheckoutTitle
}

function getDynamicCheckoutInner () {
  const dynamicCheckoutInner = document.createElement('div')
  dynamicCheckoutInner.classList.add('chk-ClickAndCollect_Inner')

  return dynamicCheckoutInner
}

function setClickAndCollectRadioState (isCollection) {
  const clickAndCollectEl = document.querySelector('.ClickAndCollect')
  const radioActiveEl = document.createElement('div')
  radioActiveEl.className = 'chk-ClickAndCollect_RadioActive'
  clickAndCollectEl.querySelector(
    '.chk-ClickAndCollect_RadioContainer',
  ).innerHTML = ''
  clickAndCollectEl.classList.remove('active')

  if (!isCollection) return
  preventAutocomplete(isCollection)
  clickAndCollectEl.classList.add('active')
  clickAndCollectEl
    .querySelector('.chk-ClickAndCollect_RadioContainer')
    .append(radioActiveEl)
}

function setHomeDeliveryRadioState (isCollection) {
  const homeDeliveryEl = document.querySelector('.HomeDelivery')
  const radioActiveEl = document.createElement('div')
  radioActiveEl.className = 'chk-ClickAndCollect_RadioActive'
  homeDeliveryEl.querySelector(
    '.chk-ClickAndCollect_RadioContainer',
  ).innerHTML = ''
  homeDeliveryEl.classList.remove('active')

  if (isCollection) return
  preventAutocomplete(isCollection)
  homeDeliveryEl.classList.add('active')
  homeDeliveryEl
    .querySelector('.chk-ClickAndCollect_RadioContainer')
    .append(radioActiveEl)
}

function preventAutocomplete (isCollection) {
  const emailInput = document.getElementById('checkout_email')
  const autocompleteOffState = navigator.userAgent.includes('Firefox')
    ? 'off'
    : 'none'
  const autocompleteState = isCollection
    ? autocompleteOffState
    : 'shipping email'

  emailInput.setAttribute('autocomplete', autocompleteState)
}

function formatForm (isCollection, resetForm) {
  setClickAndCollectRadioState(isCollection)
  setHomeDeliveryRadioState(isCollection)
  setFormVisibility(true)

  document
    .querySelector('.address-fields')
    .classList.toggle('address-fields-collect', isCollection)

  Object.keys(fields).forEach(field => {
    const fieldEl = fields[field]
    fieldEl.readOnly = isCollection
    if (resetForm && field !== 'country') {
      fieldEl.value = ''
    }
  })
}

function toggleShopPay (state) {
  try {
    const node = document
      .querySelector('[data-alternative-payments]')
      ?.querySelector('[data-testid="ShopifyPay-button"]').parentElement

    if (state === 'hide') {
      node.style.display = 'none'
    } else if (state === 'show') {
      node.style.display = 'list-item'
    }
  } catch (error) {
    console.error('Unable to find Shop Pay Checkout Button')
  }
}

async function setStoreId (value) {
  let storeId = document.querySelector(
    '[name="checkout[attributes][externalId]"]',
  )
  const submitButton = document.querySelector('#continue_button')

  submitButton.disabled = true

  if (storeId) {
    storeId.value = value
  } else {
    storeId = document.createElement('input')
    storeId.type = 'hidden'
    storeId.name = 'checkout[attributes][externalId]'
    storeId.value = value
    document.querySelector('.address-fields').append(storeId)
  }

  window.localStorage.storeId = value

  if (cart && cart.items) {
    for (const item in cart.items) {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: cart.items[item].key,
          properties: {
            _storeId: value || null,
          },
        }),
      })
    }
  }

  window.OrderSummaryUpdater && window.OrderSummaryUpdater.prototype.refresh()

  cart = await fetch('/cart.js').then(response => {
    if (!response.ok) {
      throw response
    }

    return response.json()
  })

  submitButton.disabled = false
}

window.addEventListener('evripsf-parcelshop_selected', e => {
  if (!e.detail) {
    return
  }

  toggleShopPay('hide')

  const {
    externalId,
    description,
    address: { city, county, postCode, street },
  } = e.detail

  const clickAndCollectModal = document.querySelector(
    '.chk-ClickAndCollect_Modal',
  )

  fields.postcode.value = postCode
  fields.description.value = description
  fields.street.value = street
  fields.city.value = city
  fields.county.value = county
  fields.country.value = 'United Kingdom'

  shippingInfoContainer.querySelector('.section__header').style.display =
    'block'
  shippingInfoContainer.querySelector('.section__content').style.display =
    'block'
  document.querySelector('.step__footer__continue-btn').style.display = 'block'

  clickAndCollectModal.setAttribute('aria-hidden', 'true')

  setStoreId(externalId)
  formatForm(true, false)
})

document.addEventListener('page:change', () => {
  initialiseClickAndCollect()
})

document.addEventListener('page:load', () => {
  initialiseClickAndCollect()
})
