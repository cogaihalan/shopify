class GiftWrappingForm extends HTMLElement {
  constructor () {
    super()
    this.form = this.querySelector('form')
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this))
  }

  async onSubmitHandler (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const id = Number(formData.get('id'))
    const quantity = Number(formData.get('quantity'))
    const cartItemKey = e.target.querySelector('button').dataset.cartItemKey

    if (cartItemKey === '') {
      await this.addToCart({ id, quantity })
    } else {
      await this.removeItemFromCart(cartItemKey)
    }
  }

  async addToCart (item) {
    window.BAO.Cart.addItem(
      {
        id: item.id,
        quantity: item.quantity
      },
      this.form,
      {
        sections: window.BAO.utils.sectionRenderer.pushCartSections.map(s => s.section),
      },
    )
  }

  async removeItemFromCart (key) {
    window.BAO.Cart.removeItem(
      key,
      window.BAO.utils.sectionRenderer.pushCartSections.map(s => s.section)
    )
  }
}

customElements.define('gift-wrapping-form', GiftWrappingForm)