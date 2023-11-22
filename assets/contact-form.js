// eslint-disable-next-line no-undef
class ContactForm extends HTMLElement {
  constructor () {
    super()

    this.form = this.querySelector('.sec-Form')
    this.formHeader = this.querySelector('.frm-Form_Header')
    this.subjectField = this.querySelector('#contactFormSubject')

    this.onSubjectChange()
    this.initialiseAccordion()
  }

  onSubjectChange() {
    this.subjectField.addEventListener('change', e => {
      const subjectFieldValue = e.target.value
      const subjectHandlized = subjectFieldValue.toLowerCase().trim().replaceAll(' ','-');

      this.form.dataset.subject = subjectHandlized
    })
  }

  initialiseAccordion () {
    this.handleClick = this.handleClick.bind(this)
    this.formHeader.addEventListener('click', this.handleClick)
  }

  handleClick () {
    const currentState = this.form.getAttribute('aria-expanded') === 'true'
    this.form.setAttribute('aria-expanded', !currentState)
  }
}

customElements.define('contact-form', ContactForm)
