if (!customElements.get('loyalty-lion-points')) {
  customElements.define(
    'loyalty-lion-points',
    // eslint-disable-next-line no-undef
    class LoyaltyLionPoints extends window.BAO.CustomElement() {
      connectedCallback () {
        super.connectedCallback()

        this.refreshLoyaltyLionPoints()
      }

      refreshLoyaltyLionPoints () {
        window.loyaltylion && window.loyaltylion.ui.refresh()
      }
    },
  )
}
