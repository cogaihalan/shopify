if (!customElements.get('section-account')) {
  customElements.define(
    'section-account',
    // eslint-disable-next-line no-undef
    class SectionAccount extends window.BAO.CustomElement() {
      constructor () {
        super()

        if (this.dataset.sectionAccountEnabled !== 'true') return
        if (!this.hasEl('loginForm') || !this.hasEl('recoverForm')) return
        this.handleReveal()
      }

      handleReveal () {
        const showRecoverForm =
          window.location.hash && window.location.hash === '#recover'

        const loginForm = this.getEl('loginForm')
        const recoverForm = this.getEl('recoverForm')

        loginForm.setAttribute('aria-hidden', showRecoverForm.toString())
        loginForm.removeAttribute('style')
        recoverForm.setAttribute('aria-hidden', (!showRecoverForm).toString())
        recoverForm.removeAttribute('style')

        this.setAttribute('aria-busy', 'false')
      }

      hasEl (key) {
        const hasEl = !!(this.els[key] && this.els[key].element)
        if (!hasEl) {
          this.raiseError(
            `Requires at least one "${key}" element ([data-${this.identifier}-el="${key}"])`,
          )
        }
        return hasEl
      }

      getEl (key) {
        return this.hasEl(key) ? this.els[key].element : null
      }
    },
  )
}
