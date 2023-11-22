const scrollElements = document.querySelectorAll('.scr-Scroll')

let throttleTimer

const throttle = (callback, time) => {
  if (throttleTimer) return

  throttleTimer = true
  setTimeout(() => {
    callback()
    throttleTimer = false
  }, time)
}

const elementInView = element => {
  const { top, bottom } = element.getBoundingClientRect()
  const vHeight = window.innerHeight || document.documentElement.clientHeight

  return (top > 0 || bottom > 0) && top < vHeight
}

const displayScrollElement = element => {
  element.classList.add('scr-Scroll-scrolled')
}

const handleScrollAnimation = () => {
  scrollElements.forEach(el => {
    if (elementInView(el)) {
      displayScrollElement(el)
    }
  })
}

handleScrollAnimation()
window.addEventListener('scroll', () => {
  throttle(() => {
    handleScrollAnimation()
  }, 250)
})
