class SiteDrawer extends window.BAO.CustomElement() {
  CLASSES = {
    activeDrawerClass: 'drw-Drawer-active',
  }

  constructor () {
    super()

    this.drawers = this.closest('site-drawers')
    if (!this.drawers) {
      throw new Error(
        `${this.nodeName.toLowerCase()} should be inside a <site-drawers> element`,
      )
    }
    this.drawers.drawers.push(this)

    this._isOpen = false

    if (this.drawerShouldBeMoved) {
      window.setTimeout(() => {
        this.moveToElement.appendChild(this)
      }, parseInt(this.getAttribute('data-module-drawers-move-delay'), 10) || 0)
    }
  }

  get key () {
    return this.getAttribute('key')
  }

  get elements () {
    return {
      trigger: window.BAO.utils.getElement(
        `[data-drawers-trigger=${this.key}]`,
      ),
      close: window.BAO.utils.getElement(
        `[data-module-drawers-close=${this.key}]`,
      ),
    }
  }

  get isOpen () {
    return this._isOpen
  }

  set isOpen (val) {
    this._isOpen = val

    this.classList.toggle(this.CLASSES.activeDrawerClass, val)
  }

  get drawerShouldBeMoved () {
    return this.hasAttribute('data-module-drawers-move-me')
  }

  get moveToElement () {
    switch (this.getAttribute('data-module-drawers-move-me')) {
      case 'root':
        return this.drawers
      case 'over':
        return this.drawers.els.drawer.element
      default:
        return window.BAO.utils.getElement(
          this.getAttribute('data-module-drawers-move-me'),
        )
    }
  }
}

customElements.define('site-drawer', SiteDrawer)
