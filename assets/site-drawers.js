class SiteDrawers extends window.BAO.CustomElement() {
  _activeDrawerKey = ''
  drawers = []

  MATCHES = {
    trigger: '[data-drawers-trigger]',
    subNav: '[data-drawers-sub-nav]',
    back: '[data-drawers-back]',
    close: '[data-drawers-close]',
    backdrop: '[data-site-drawers-el="backdrop"]',
    header: '[data-section-type="header"]',
  }

  ELS = {
    body: document.body || document.documentElement,
    backdrop: '[data-site-drawers-el="backdrop"]',
    drawers: document.querySelector('site-drawers'),
  }

  CLASSES = {
    activeClass: 'drw-Drawers-active',
    activeDrawerClass: 'drw-Drawer-active',
    siteOverflowed: 'util-SiteOverflowed',
    drawersOpenUtility: 'util-DrawersOpen',
  }

  constructor () {
    super()

    if (this.hasAlreadyBeenUsed) {
      throw new Error(
        `You can only use 1 instance of ${this.nodeName.toLowerCase()}`,
      )
    }

    window.drawers = this

    this.drawerKeys
      .filter(key => !this.triggerKeys.includes(key))
      .forEach(key =>
        console.info(`Drawer exists for ${key} but there is no trigger`),
      )
  }

  setupListeners () {
    super.setupListeners()

    this.listeners.add(
      document.documentElement,
      'click',
      this.handleClick.bind(this),
    )
  }

  handleClick (e) {
    const eventType = (() => {
      if (e.target.closest(this.MATCHES.trigger) !== null) {
        return 'TRIGGER'
      } else if (e.target.closest(this.MATCHES.back) !== null) {
        return 'BACK'
      } else if (e.target.closest(this.MATCHES.close) !== null) {
        return 'CLOSE'
      } else if (e.target.closest(this.MATCHES.backdrop) !== null) {
        return 'BACKDROP'
      } else if (e.target.closest(this.MATCHES.header) !== null) {
        return 'HEADER'
      }

      return 'UNKNOWN'
    })()

    if (eventType === 'HEADER') {
      this.isSubDrawerTrigger = false
      this.activeDrawerKey = ''
      this.parentDrawerKey = ''

      return
    }

    if (eventType === 'UNKNOWN') return
    e.preventDefault()

    if (eventType === 'TRIGGER') {
      const trigger = e.target.closest(this.MATCHES.trigger)
      const key = trigger.getAttribute('data-drawers-trigger')

      this.isSubDrawerTrigger = e.target.closest(this.MATCHES.subNav)

      if (this.triggerKeys.includes(key)) {
        if (this.isSubDrawerTrigger) {
          this.parentDrawerKey = !this.parentDrawerKey
            ? this.activeDrawerKey
            : this.parentDrawerKey
          this.activeDrawerKey = key
        } else {
          this.activeDrawerKey =
            key === this.activeDrawerKey || key === this.parentDrawerKey
              ? ''
              : key
          this.parentDrawerKey = ''
        }
      }

      this.getParentDrawers(trigger).forEach(parentDrawer => {
        parentDrawer.classList.add('drw-Drawer-active')
      })
    }

    if (eventType === 'BACK') {
      const backButton = e.target.closest(this.MATCHES.back)
      const key = backButton.getAttribute('data-drawers-back')
      this.drawers
        .filter(drawer => drawer.key === key)
        .forEach(drawer => (drawer.isOpen = false))
    }

    if (eventType === 'CLOSE' || eventType === 'BACKDROP') {
      this.isSubDrawerTrigger = false
      this.activeDrawerKey = ''
      this.parentDrawerKey = ''
    }
  }

  get triggerKeys () {
    return window.BAO.utils
      .getElements('[data-drawers-trigger]')
      .map(el => el.getAttribute('data-drawers-trigger'))
  }

  get drawerKeys () {
    return window.BAO.utils
      .getElements('[data-module-drawers-drawer]')
      .map(el => el.getAttribute('data-module-drawers-drawer'))
  }

  get hasAlreadyBeenUsed () {
    const el = window.BAO.utils.getElement(this.nodeName.toLowerCase())

    return el !== this
  }

  get aDrawerIsOpen () {
    return this.drawers.some(drawer => drawer.isOpen)
  }

  get activeDrawerKey () {
    return this._activeDrawerKey
  }

  set activeDrawerKey (key) {
    if (!this.isSubDrawerTrigger) {
      document.body.classList.remove(`drw-Drawers-${this.activeDrawerKey}`)
      document.body.classList.remove(`drw-Drawers-${this.parentDrawerKey}`)

      if (key !== '') {
        document.body.classList.add(`drw-Drawers-${key}`)
      }
    }

    this._activeDrawerKey = key

    this.drawers.forEach(drawer => (drawer.isOpen = drawer.key === key))

    if (!this.isSubDrawerTrigger) {
      this.ELS.drawers.classList.toggle(
        this.CLASSES.activeClass,
        this.aDrawerIsOpen,
      )
      document.body.classList.toggle(
        this.CLASSES.siteOverflowed,
        this.aDrawerIsOpen,
      )
      document.body.classList.toggle(
        this.CLASSES.drawersOpenUtility,
        this.aDrawerIsOpen,
      )

      if (key !== '') {
        this.els.drawer.element.classList.add('drw-Drawers_Drawer-active')
        document.body.classList.add(`drw-Drawers-${key}`)
      } else {
        this.els.drawer.element.classList.remove('drw-Drawers_Drawer-active')
      }
    }
  }

  getParentDrawers (trigger) {
    const drawerKeys = trigger.dataset.drawersParentKeys
      ? trigger.dataset.drawersParentKeys.split(',')
      : []
    return drawerKeys.map(drawerKey => {
      return window.BAO.utils.getElement(`[key="${drawerKey}"]`, this)
    })
  }
}

customElements.define('site-drawers', SiteDrawers)
