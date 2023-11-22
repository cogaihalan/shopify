/* eslint-disable */
;(function (algolia) {
  'use strict'

  const createLocalStorageRecentSearchesPlugin =
    algolia.externals.createLocalStorageRecentSearchesPlugin

  algolia.recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'RECENT_SEARCH',
    limit: 5
  })
})(window.algoliaShopify)
