// eslint-disable-next-line import/no-unresolved
import gsap from 'https://cdn.skypack.dev/gsap@3.11.0'

class Cursor extends HTMLElement {
  constructor () {
    super()
    this.el = this.querySelector('.cur-Cursor')
    this.cursorEls = document.querySelectorAll('[data-cursor-element]')

    this.cursorSettings = {
      x: -200,
      y: -200,
    }

    if (!this.el || !this.cursorEls) return

    if (window.innerWidth < 900) return
    setTimeout(() => {
      this.initCursor()
    }, 500)
  }

  initCursor () {
    this.cursorSettings.x = -100
    this.cursorSettings.y = -100

    document.addEventListener('mousemove', e => {
      this.cursorSettings.x = e.clientX
      this.cursorSettings.y = e.clientY
    })

    const renderCursor = () => {
      gsap.to(this.el, 0.5, {
        x: this.cursorSettings.x,
        y: this.cursorSettings.y,
      })

      requestAnimationFrame(renderCursor)
    }

    const handleElementEnter = e => {
      const cursorAction = e.target.dataset.cursorElement

      this.el.classList.add(`cur-Cursor-${cursorAction}`)
    }

    const handleElementLeave = e => {
      const cursorAction = e.target.dataset.cursorElement
      this.el.classList.remove(`cur-Cursor-${cursorAction}`)
    }

    this.cursorEls.forEach(cursorHoverElement => {
      cursorHoverElement.addEventListener('mouseenter', handleElementEnter)
      cursorHoverElement.addEventListener('mouseleave', handleElementLeave)
    })

    requestAnimationFrame(renderCursor)
  }
}

customElements.define('custom-cursor', Cursor)
