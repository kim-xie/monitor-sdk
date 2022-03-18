import { originalOpen, originalSend, originalProto } from '../utils/xhr'
import { lazyReportCache } from '../utils/report'
import { getPageURL } from '../utils/utils'

function overwriteOpenAndSend() {
  originalProto.open = function newOpen(...args) {
    this.url = args[1]
    this.method = args[0]
    originalOpen.apply(this, args)
  }

  originalProto.send = function newSend(...args) {
    this.startTime = Date.now()
    const onLoadend = () => {
      this.endTime = Date.now()
      this.duration = this.endTime - this.startTime
      const { status, duration, startTime, endTime, url, method } = this
      const reportData = {
        type: 'performance',
        subType: 'xhr',
        pageURL: getPageURL(),
        status,
        duration,
        startTime,
        endTime,
        url,
        method: (method || 'GET').toUpperCase(),
        success: status >= 200 && status < 300
      }

      lazyReportCache(reportData)

      this.removeEventListener('loadend', onLoadend, true)
    }

    this.addEventListener('loadend', onLoadend, true)
    originalSend.apply(this, args)
  }
}

export default function xhr() {
  overwriteOpenAndSend()
}
