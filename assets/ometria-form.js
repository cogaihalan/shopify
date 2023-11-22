// eslint-disable-next-line no-undef
class OmetriaForm extends window.BAO.CustomElement() {
  setupListeners () {
    if (this.els?.form) {
      this.listeners.add(
        this.els.form.element,
        'submit',
        this.handleFormSubmit.bind(this),
      )
    }

    if (this.els.optIn) {
      this.listeners.add(
        this.els.optIn.element,
        'change',
        this.setOptIn.bind(this),
      )
    }
  }

  async handleFormSubmit (e) {
    e.preventDefault()
    this.setLoading(true)

    const form = e.target

    await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: this.formatFormData(form),
    })
      .then(response => response.json())
      .then(response => {
        if (!response.ok) {
          this.handleError(response.errors)
          return
        }

        this.showSuccess()
      })
  }

  formatFormData (form) {
    const formElements = form.elements

    const urlEncodedDataPairs = Object.keys(formElements).map(key => {
      const { name, value } = formElements[key]
      return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    })

    return urlEncodedDataPairs.join('&').replace(/%20/g, '+')
  }

  handleError (errors) {
    this.setLoading(false)
    this.setMessage(errors.map(error => `<h3>${error[1]}</h3>`))
  }

  showSuccess () {
    this.setMessage(`<h3>${this.dataset.success}</h3>`)
    this.els.messages.element.classList.add('nws-Newsletter_Messages-success')
    this.els.fields.element.remove()
  }

  setMessage (messages) {
    this.els.messages.element.innerHTML = messages
  }

  setLoading (isLoading) {
    this.els.submit.element.disabled = isLoading
  }

  setOptIn (e) {
    if (!this.els.marketingHiddenField) return

    this.els.marketingHiddenField.element.value = e.target.checked
      ? 'SUBSCRIBED'
      : 'UNCHANGED'
  }
}

if (!customElements.get('ometria-form')) {
  customElements.define('ometria-form', OmetriaForm)
}
