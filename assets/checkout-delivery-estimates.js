document.addEventListener('page:load', () => {
  if (window.Shopify.Checkout.step !== 'shipping_method') return

  setupDeliveryEstimates()
  setDefaultDeliveryEstimate()
})

document.addEventListener('page:change', () => {
  if (window.Shopify.Checkout.step !== 'shipping_method') return

  setupDeliveryEstimates()
  setDefaultDeliveryEstimate()
})

document.addEventListener('page:load', () => {
  if (window.Shopify.Checkout.step !== 'payment_method') return
  setOrderNote()
})

document.addEventListener('page:change', () => {
  if (window.Shopify.Checkout.step !== 'payment_method') return
  setOrderNote()
})

document.addEventListener('page:load', () => {
  if (
    window.Shopify.Checkout.step === 'thank_you' ||
    window.Shopify.Checkout.isOrderStatusPage
  ) {
    injectEstimatedDeliveryIntoThankYouPage()
  }
})

document.addEventListener('page:change', () => {
  if (
    window.Shopify.Checkout.step === 'thank_you' ||
    window.Shopify.Checkout.isOrderStatusPage
  ) {
    injectEstimatedDeliveryIntoThankYouPage()
  }
})

function setDefaultDeliveryEstimate () {
  const defaultShippingMethod = Array.from(
    document.querySelectorAll('[name="checkout[shipping_rate][id]"]'),
  ).find(shippingMethod => {
    return shippingMethod.checked === true
  })

  if (!defaultShippingMethod) return

  const shippingContainer = defaultShippingMethod.closest(
    '[data-shipping-method]',
  )
  const chosenShippingMethod = shippingContainer.querySelector(
    '[data-shipping-method-label-title]',
  )

  getDeliveryInfo(chosenShippingMethod)
}

function setupDeliveryEstimates () {
  const container = getShippingMethodsContainer()
  if (!container) return

  container.addEventListener('change', onShippingMethodSelection)
}

function onShippingMethodSelection (e) {
  const shippingContainer = e.target.closest('[data-shipping-method]')
  const chosenShippingMethod = shippingContainer.querySelector(
    '[data-shipping-method-label-title]',
  )

  getDeliveryInfo(chosenShippingMethod)
}

function getDeliveryInfo (chosenShippingMethod) {
  const currentEstimateEl = document.querySelector('.chk-DeliveryEstimates')
  if (currentEstimateEl) {
    currentEstimateEl.remove()
  }

  const deliveryEstimates = JSON.parse(
    document.getElementById('checkout-delivery').textContent,
  )

  const matchedDelivery = deliveryEstimates.find(deliveryEstimate => {
    return (
      deliveryEstimate.title ===
      chosenShippingMethod.dataset.shippingMethodLabelTitle
    )
  })

  if (!matchedDelivery) return

  const deliveryMessage = generateDeliveryMessage(matchedDelivery)

  const shippingContainer = document.querySelector('.section--shipping-method')
  shippingContainer.insertAdjacentHTML('beforeend', deliveryMessage)
}

function generateDeliveryMessage (deliveryInfo) {
  const currentDate = new Date()
  const currentHour = currentDate.getHours()

  const isAfterCutoff = currentHour >= deliveryInfo.cutoff
  const daysToAdd = isAfterCutoff ? deliveryInfo.days + 1 : deliveryInfo.days

  const estimatedDate = addWorkDays(
    currentDate,
    daysToAdd,
    deliveryInfo.includeSaturday,
    deliveryInfo.includeSunday,
  )

  sessionStorage.setItem(
    'estimated_date',
    `${estimatedDate
      .toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
      .replace(',', '')}`,
  )

  return `
    <div class="chk-DeliveryEstimates">
      ${deliveryInfo.message}
      <span class="chk-DeliveryEstimates_Date fz-14_20-headings">
        ${estimatedDate
          .toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })
          .replace(',', '')}
      </span>
    </div>`
}

function setOrderNote () {
  const sessionSavedEstimatedDate = sessionStorage.getItem('estimated_date')
  if (!sessionSavedEstimatedDate) return

  const checkoutSubmitNode = document.querySelector('form[data-payment-form]')

  if (!checkoutSubmitNode) return

  const noteFragment = `
    <input name="checkout[attributes][estimated-delivery]" id="CartNote" hidden value="${sessionSavedEstimatedDate}"/>
  `

  checkoutSubmitNode.insertAdjacentHTML('afterbegin', noteFragment)
}

function addWorkDays (startDate, days, includeSaturday, includeSunday) {
  // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
  const dow = startDate.getDay()
  let daysToAdd = parseInt(days)

  // If the current day is Sunday add one day
  if (dow === 0) daysToAdd++

  const weekendDeliveryDays =
    includeSaturday && includeSunday
      ? 2
      : includeSaturday || includeSunday
        ? 1
        : 0

  // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
  if (
    (!includeSaturday && dow + daysToAdd >= 6) ||
    (includeSaturday && dow + daysToAdd >= 7)
  ) {
    // Subtract days in current working week from work days
    const remainingWorkDays = daysToAdd - (5 + weekendDeliveryDays - dow)

    // Add current working week's weekend
    daysToAdd += 2 - weekendDeliveryDays
    if (remainingWorkDays > 5 + weekendDeliveryDays) {
      // Add two days for each working week by calculating how many weeks are included
      daysToAdd +=
        (2 - weekendDeliveryDays) *
        Math.floor(remainingWorkDays / (5 + weekendDeliveryDays))

      // Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
      if (remainingWorkDays % (5 + weekendDeliveryDays) === 0) {
        daysToAdd -= 2 - weekendDeliveryDays
      }
    }
  }

  startDate.setDate(startDate.getDate() + daysToAdd)

  return startDate
}

function injectEstimatedDeliveryIntoThankYouPage () {
  const thankYouStepNode = document.querySelector('[data-step="thank_you"]')

  if (!thankYouStepNode) return

  const isOrderCanceled = thankYouStepNode
    .querySelector('#main-header')
    .innerText.includes('Order canceled')

  if (isOrderCanceled) return

  const fragment = `
    <div class="chk-DeliveryEstimates">
      Estimated Delivery Date:
      <span class="chk-DeliveryEstimates_Date fz-14_20-headings">
        ${
          window.theme.orderAttributes.find(obj => obj['estimated-delivery'])[
            'estimated-delivery'
          ]
        }
      </span>
    </div>
  `

  thankYouStepNode
    .querySelector('.step__footer')
    .insertAdjacentHTML('beforebegin', fragment)
}

function getShippingMethodsContainer () {
  return document.querySelector('[data-shipping-methods]')
}
