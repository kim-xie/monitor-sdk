import { isSupportPerformanceObserver } from './utils'
import { onBFCacheRestore, getPageURL } from '../utils/utils'
import { lazyReportCache } from '../utils/report'

let lcpDone = false
export function isLCPDone() {
  return lcpDone
}

export default function observeLCP() {
  if (!isSupportPerformanceObserver()) {
    lcpDone = true
    return
  }

  const entryHandler = list => {
    lcpDone = true

    if (observer) {
      observer.disconnect()
    }

    for (const entry of list.getEntries()) {
      const json = entry.toJSON()
      delete json.duration

      const reportData = {
        type: 'performance',
        subType: entry.entryType,
        pageURL: getPageURL(),
        name: entry.entryType,
        ...json,
        target: entry.element?.tagName.toLowerCase()
      }

      lazyReportCache(reportData)
    }
  }

  const observer = new PerformanceObserver(entryHandler)
  observer.observe({ type: 'largest-contentful-paint', buffered: true })

  onBFCacheRestore(event => {
    requestAnimationFrame(() => {
      lazyReportCache({
        type: 'performance',
        subType: 'largest-contentful-paint',
        pageURL: getPageURL(),
        startTime: performance.now() - event.timeStamp,
        name: 'largest-contentful-paint',
        bfc: true
      })
    })
  })
}
