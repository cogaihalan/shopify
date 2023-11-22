if (!customElements.get('currency-select')) {
  customElements.define(
    'currency-select',
    class CurrencySelect extends HTMLSelectElement {
      constructor () {
        super()

        this.handleChange = this.handleChange.bind(this)
      }

      connectedCallback () {
        this.addEventListener('change', this.handleChange)
      }

      disconnectedCallback () {
        this.addEventListener('change', this.handleChange)
      }

      handleChange (e) {
        window.location.href = e.target.value
      }
    },
    {
      extends: 'select',
    },
  )
}
