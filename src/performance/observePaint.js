import { isSupportPerformanceObserver } from './utils'
import { onBFCacheRestore, getPageURL } from '../utils/utils'
import { lazyReportCache } from '../utils/report'

export default function observePaint() {
  if (!isSupportPerformanceObserver()) return

  const entryHandler = list => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        observer.disconnect()
      }

      const json = entry.toJSON()
      delete json.duration

      const reportData = {
        type: 'performance',
        subType: entry.name,
        pageURL: getPageURL(),
        ...json
      }

      lazyReportCache(reportData)
    }
  }

  const observer = new PerformanceObserver(entryHandler)
  observer.observe({ type: 'paint', buffered: true })

  onBFCacheRestore(event => {
    requestAnimationFrame(() => {
      const evenList = ['first-paint', 'first-contentful-paint']
      evenList.forEach(type => {
        lazyReportCache({
          type: 'performance',
          subType: type,
          pageURL: getPageURL(),
          startTime: performance.now() - event.timeStamp,
          name: type,
          bfc: true
        })
      })
    })
  })
}
