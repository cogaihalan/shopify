if (!customElements.get('store-selector')) {
  customElements.define(
    'store-selector',
    class StoreSelector extends window.BAO.CustomElement() {
      _apiKey = 'd7c83eb0d2dd40f791ccb65bab1768af'

      constructor () {
        super()

        if (window.location.hash === '#geo') {
          return this.forceRedirect()
        }

        // eslint-disable-next-line compat/compat
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop),
        })
        const currencyParam = params.currency

        if (
          !this.noChoiceMade &&
          !this.noLocationStored &&
          currencyParam == null
        ) {
          return
        }

        if (currencyParam !== null) {
          return this.setStorageFromURL(currencyParam)
        }

        window.BAO.utils
          .fetchJSON(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${this._apiKey}&fields=currency`,
            {
              method: 'GET',
            },
          )
          .then(res => {
            this.setupCurrencySwitcherModal(res.currency.code)
          })
      }

      setupListeners () {
        super.setupListeners()

        this.onConfirmClick = this.onConfirmClick.bind(this)
        this.onCloseClick = this.onCloseClick.bind(this)
        this.onOptionsClick = this.onOptionsClick.bind(this)

        if (this.els?.options.exists) {
          this.listeners.add(
            this.els.options.element,
            'change',
            this.onOptionsClick,
          )
        }

        if (this.els?.confirm.exists) {
          this.els.confirm.elements.forEach(selectEl => {
            this.listeners.add(selectEl, 'click', this.onConfirmClick)
          })
        }

        if (this.els?.close.exists) {
          this.els.close.elements.forEach(closeEL => {
            this.listeners.add(closeEL, 'click', this.onCloseClick)
          })
        }
      }

      setStorageFromURL (currencyCode) {
        const strippedCurrencyCode = currencyCode.replace('/', '')
        window.localStorage.setItem(this.storageName, 'true')
        window.localStorage.setItem(this.userCurrencyName, strippedCurrencyCode)
      }

      onOptionsClick () {
        const selectedOptionValue = this.els.options.element.value
        const selectedOptionCode = this.els.options.element.options[
          this.els.options.element.selectedIndex
        ].dataset.code

        this.els.confirm.elements.forEach(confirmEl => {
          confirmEl.dataset.url = this.sites[selectedOptionValue]
          confirmEl.dataset.code = selectedOptionCode
        })
      }

      onConfirmClick (event) {
        event.preventDefault()

        window.localStorage.setItem(this.storageName, 'true')
        window.localStorage.setItem(
          this.userCurrencyName,
          event.currentTarget.dataset.code,
        )

        if (
          event.currentTarget.hasAttribute('data-url') &&
          window.location.href.indexOf(event.currentTarget.dataset.url) === -1
        ) {
          window.location.href = `${event.currentTarget.dataset.url}`
        } else {
          this.setAttribute('aria-hidden', 'true')
          document.body.classList.remove('util-SiteOverflowed')
        }
      }

      onCloseClick (event) {
        event.preventDefault()

        window.localStorage.setItem(this.storageName, 'true')
        window.localStorage.setItem(this.userCurrencyName, this.dataset.store)

        this.setAttribute('aria-hidden', 'true')
        document.body.classList.remove('util-SiteOverflowed')
      }

      setupCurrencySwitcherModal (currencyCode) {
        if (currencyCode === this.dataset.store) {
          window.localStorage.setItem(this.storageName, 'true')
          window.localStorage.setItem(this.userCurrencyName, currencyCode)
          return
        }

        this.createOptionsList(currencyCode)
        this.setDefaultConfirmButtonURL()
        this.setAttribute('aria-hidden', 'false')
        document.body.classList.add('util-SiteOverflowed')
      }

      createOptionsList (currencyCode) {
        Object.entries(this.currencies).forEach(([key, value]) => {
          const { name } = value
          const isCurrentSite = key.toLowerCase() === currencyCode.toLowerCase()
          this.els.options.element.innerHTML += this.createOptionElement(
            key,
            isCurrentSite,
            name,
          )
        })
      }

      createOptionElement (code, isCurrentSite, name) {
        return `<option
            class="sec-StoreSelector_Option"
            data-code="${code}"
            value="${code}"
            ${isCurrentSite ? 'selected' : ''}
          >
            ${name}
          </option>`
      }

      setDefaultConfirmButtonURL () {
        const selectedOptionValue = this.els.options.element.value
        const selectedOptionCode = this.els.options.element.options[
          this.els.options.element.selectedIndex
        ].dataset.code

        this.els.confirm.elements.forEach(confirmEl => {
          confirmEl.dataset.url = this.sites[selectedOptionValue]
          confirmEl.dataset.code = selectedOptionCode
        })
      }

      async forceRedirect () {
        return await window.BAO.utils
          .fetchJSON(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${this._apiKey}&fields=currency`,
            {
              method: 'GET',
            },
          )
          .then(res => {
            /* Redirect the customer to the current path, but adjust the domain based on their geolocation */
            const destination = new URL(this.sites[res.currency.code])
            destination.pathname = window.location.pathname
            window.location.href = destination.href
          })
      }

      get noChoiceMade () {
        return (
          window.localStorage.getItem(this.storageName) == null ||
          (window.localStorage.getItem(this.storageName) === undefined &&
            !Shopify.designMode)
        )
      }

      get noLocationStored () {
        return (
          window.localStorage.getItem(this.userCurrencyName) == null ||
          (window.localStorage.getItem(this.userCurrencyName) === undefined &&
            !Shopify.designMode)
        )
      }

      get storageName () {
        return 'BAO-store-polly'
      }

      get userCurrencyName () {
        return 'BAO-currency-polly'
      }

      get sites () {
        return {
          GBP: 'https://www.ohpolly.com?currency=GBP',
          USD: 'https://us.ohpolly.com?currency=USD',
          AED: 'https://www.ohpolly.com?currency=AED',
          AUD: 'https://au.ohpolly.com?currency=AUD',
          CAD: 'https://www.ohpolly.com?currency=CAD',
          CHF: 'https://www.ohpolly.com?currency=CHF',
          EUR: 'https://www.ohpolly.com?currency=EUR',
          ILS: 'https://www.ohpolly.com?currency=ILS',
          NOK: 'https://www.ohpolly.com?currency=NOK',
          PLN: 'https://www.ohpolly.com?currency=PLN',
          SEK: 'https://www.ohpolly.com?currency=SEK',
        }
      }

      get currencies () {
        return {
          GBP: { name: '£ GBP' },
          USD: { name: '$ USD' },
          AED: { name: 'د.إ' },
          AUD: { name: '$ AUD' },
          CAD: { name: '$ CAD' },
          CHF: { name: 'CHF CHF' },
          EUR: { name: '€ EUR' },
          ILS: { name: '₪ ILS' },
          NOK: { name: 'kr NOK' },
          PLN: { name: 'zł PLN' },
          SEK: { name: 'kr SEK' },
        }
      }
    },
  )
}
