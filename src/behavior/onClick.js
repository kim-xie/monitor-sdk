import { lazyReportCache } from '../utils/report'
import { getPageURL, getSelectors } from '../utils/utils'
import { getUUID } from './utils'

export default function onClick() {
  const eventList = ['mousedown', 'touchstart']

  eventList.forEach(eventType => {
    let timer
    window.addEventListener(eventType, event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const target = event.target
        const { top, left } = target.getBoundingClientRect()
        lazyReportCache({
          type: 'behavior',
          subType: 'click',
          pageURL: getPageURL(),
          startTime: event.timeStamp,
          top,
          left,
          eventType,
          pageHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
          scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
          target: target.tagName.toLowerCase(),
          paths: getSelectors(event.path),
          outerHTML: target.outerHTML,
          innerHTML: target.innerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          uuid: getUUID()
        })
      }, 500)
    })
  })
}
