import { getPageURL } from '../utils/utils'
import { lazyReportCache } from '../utils/report'
import { getUUID } from './utils'

export default function pageChange() {
  let from = ''
  window.addEventListener(
    'popstate',
    () => {
      const to = getPageURL()

      lazyReportCache({
        type: 'behavior',
        subType: 'popstate',
        startTime: performance.now(),
        from,
        to,
        uuid: getUUID()
      })

      from = to
    },
    true
  )

  let oldURL = ''
  window.addEventListener(
    'hashchange',
    event => {
      const newURL = event.newURL

      lazyReportCache({
        type: 'behavior',
        subType: 'hashchange',
        startTime: performance.now(),
        from: oldURL,
        to: newURL,
        uuid: getUUID()
      })

      oldURL = newURL
    },
    true
  )
}
