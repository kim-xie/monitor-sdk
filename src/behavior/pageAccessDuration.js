import { report } from '../utils/report'
import { onBeforeunload, getPageURL } from '../utils/utils'
import { getUUID } from './utils'

export default function pageAccessDuration() {
  onBeforeunload(() => {
    report(
      {
        type: 'behavior',
        subType: 'page-access-duration',
        pageURL: getPageURL(),
        startTime: performance.now(),
        uuid: getUUID()
      },
      true
    )
  })
}
