window.addEventListener('load', () => {
  const parentEl = window.BAO.utils.getElement('[data-overflow-element')
  const el = document.querySelector(parentEl.dataset.overflowElement)

  el.style.cursor = 'grab'

  let pos = { top: 0, left: 0, x: 0, y: 0 }

  const mouseDownHandler = function (e) {
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'

    pos = {
      left: el.scrollLeft,
      top: el.scrollTop,

      x: e.clientX,
      y: e.clientY,
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - pos.x
    const dy = e.clientY - pos.y

    el.scrollTop = pos.top - dy
    el.scrollLeft = pos.left - dx
  }

  const mouseUpHandler = function () {
    el.style.cursor = 'grab'
    el.style.removeProperty('user-select')

    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }

  el.addEventListener('mousedown', mouseDownHandler)
})
