/**
 * Inserts a custom 'Additional information' section containing a 'Personal Customs Code' input field into the checkout page if certain conditions are met.
 */

function App () {
  const error = Shopify.Checkout.page === 'update'
  const nodeToInjectAfter = document.querySelector('[data-payment-method]')
  const countryCode = window.theme.checkout_country_code.toLowerCase()

  if (Shopify.Checkout.step !== 'payment_method') return
  if (
    document.querySelector(
      `[checkout_localized_fields_shipping_credential_${countryCode}]`,
    )
  ) {
    return
  }

  const fragment = `
    <div class="section section--custom-fields">
      <div class="section__header">
        <h2 class="section__title" tabindex="-1">Additional information</h2>
      </div>

      <div class="section__content">
        <div class="fieldset">
          <div class="field field--required  ${error ? 'field--error' : ''}">
            <div class="field__input-wrapper"><label class="field__label field__label--visible" for="checkout_localized_fields_shipping_credential_${countryCode}">Personal Customs Code</label>
              <input placeholder="Personal Customs Code" class="field__input" autocomplete="off" aria-required="true" size="30" type="text" name="checkout[attributes][estimated-delivery]" id="checkout_localized_fields_shipping_credential_${countryCode}">
            </div>
            ${
              error
                ? `<p class="field__message field__message--error" id="error-for-shipping_credential_${countryCode}">Enter a valid Personal Customs Code</p>`
                : ''
            }
          </div>
        </div>
      </div>
    </div>
  `

  nodeToInjectAfter.insertAdjacentHTML('beforebegin', fragment)
}

App()
