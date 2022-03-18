import { lazyReportCache } from '../utils/report'
import { getPageURL } from '../utils/utils'

const originalFetch = window.fetch

function overwriteFetch() {
  window.fetch = function newFetch(url, config) {
    const startTime = Date.now()
    const reportData = {
      type: 'performance',
      subType: 'fetch',
      pageURL: getPageURL(),
      startTime,
      url,
      method: (config?.method || 'GET').toUpperCase()
    }

    return originalFetch(url, config)
      .then(res => {
        reportData.endTime = Date.now()
        reportData.duration = reportData.endTime - reportData.startTime

        const data = res.clone()
        reportData.status = data.status
        reportData.success = data.ok

        lazyReportCache(reportData)

        return res
      })
      .catch(err => {
        reportData.endTime = Date.now()
        reportData.duration = reportData.endTime - reportData.startTime
        reportData.status = 0
        reportData.success = false

        lazyReportCache(reportData)

        throw err
      })
  }
}

export default function fetch() {
  overwriteFetch()
}
