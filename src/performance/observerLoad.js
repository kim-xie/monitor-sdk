import { lazyReportCache } from '../utils/report'
import { onBFCacheRestore, getPageURL } from '../utils/utils'

export default function observerLoad() {
  const evenList = ['load', 'DOMContentLoaded']
  evenList.forEach(type => onEvent(type))

  onBFCacheRestore(event => {
    requestAnimationFrame(() => {
      evenList.forEach(type => {
        lazyReportCache({
          type: 'performance',
          subType: type.toLocaleLowerCase(),
          pageURL: getPageURL(),
          startTime: performance.now() - event.timeStamp,
          bfc: true
        })
      })
    })
  })
}

function onEvent(type) {
  function callback() {
    lazyReportCache({
      type: 'performance',
      subType: type.toLocaleLowerCase(),
      pageURL: getPageURL(),
      startTime: performance.now()
    })

    window.removeEventListener(type, callback, true)
  }

  window.addEventListener(type, callback, true)
}
