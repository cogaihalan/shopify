const myInterval = setInterval(initializeWishlist, 200);

function setWishlistTotal(products) {
  const wishlistCountEls = document.querySelectorAll('[data-swym-wishlist-count]')

  window._swat.wishlistCount(
    function(count) {
      wishlistCountEls.forEach(wishlistCountEl => {
        if(count > 0) {
          wishlistCountEl.textContent = count
          wishlistCountEl.setAttribute("aria-hidden","false")
        } else {
          wishlistCountEl.setAttribute("aria-hidden","true")
        }
      })
    }
  );


}

function setProductCardWishlistStateToAdded(products) {
  products.forEach(product => {
    document.querySelectorAll(`[data-wishlist-button][data-variant-id="${product.epi.toString()}"]`).forEach(wishlistButtonEl => {
      wishlistButtonEl.setAttribute('data-wishlist-status','added')
    })
  })
}

function initializeWishlist() {
  // If _swat doesn't initalise after 10 seconds - escape the callback
  setTimeout(() => {
    escapeInterval()
  },10000)

  if(!window._swat) return
  escapeInterval()
  window._swat.fetch((products) => {
    window.wishlistProducts = products
    setWishlistTotal(products)
    setProductCardWishlistStateToAdded(products)
  });
}

function escapeInterval() {
  clearInterval(myInterval);
}

window.BAO.eventBus.addEventListener(
  window.BAO.EVENTS.WISHLIST.UPDATED, () => {
    window._swat.fetch(function(products){
      window.wishlistProducts = products
      setWishlistTotal(products)
      setProductCardWishlistStateToAdded(products)
    });
  }
)
