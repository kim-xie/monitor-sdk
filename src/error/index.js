import { lazyReportCache } from '../utils/report'
import { onBFCacheRestore, getPageURL, getLines, getLastEvent, getSelectors } from '../utils/utils'
import config from '../config'

export default function captureError() {
  // 控制台报错
  const oldConsoleError = window.console.error
  window.console.error = (...args) => {
    oldConsoleError.apply(this, args)
    lazyReportCache({
      type: 'error',
      subType: 'consoleError',
      pageURL: getPageURL(),
      startTime: performance.now(),
      message: args
    })
  }

  // 监听资源加载或者js报错
  window.addEventListener(
    'error',
    e => {
      const { target } = e
      const lastEvent = getLastEvent() // 获取最后一个交互事件
      // 捕获资源加载失败错误 js css img...
      if (target && (target.src || target.href)) {
        const url = target.src || target.href
        lazyReportCache({
          type: 'error',
          subType: 'resourceError',
          pageURL: getPageURL(),
          startTime: e.timeStamp,
          url,
          tagName: target.tagName,
          message: e.message,
          stack: getLines(e.error.stack),
          paths: lastEvent ? getSelectors(lastEvent) : ''
        })
      } else {
        // 捕获js错误
        lazyReportCache({
          type: 'error',
          subType: 'jsError',
          pageURL: getPageURL(),
          startTime: e.timeStamp,
          position: `${e.lineno}:${e.colno}`,
          paths: lastEvent ? getSelectors(lastEvent) : '',
          message: e.message,
          stack: getLines(e.error.stack)
        })
      }
    },
    true
  )

  // 监听 js 错误
  //   window.onerror = (msg, url, line, column, error) => {
  //     lazyReportCache({
  //       msg,
  //       line,
  //       column,
  //       error: error.stack.toString(),
  //       pageURL: url,
  //       type: 'error',
  //       subType: 'jsError',
  //       startTime: performance.now()
  //     })
  //   }

  // 监听 promise 错误
  window.addEventListener('unhandledrejection', e => {
    const { reason } = e
    let message = ''
    let lineno = 0
    let colno = 0
    let stack = null
    if (typeof reason === 'string') {
      message = reason
    } else if (typeof reason === 'object') {
      if (reason?.stack) {
        const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
        lineno = matchResult[2]
        colno = matchResult[3]
      }
      message = reason.stack.message
      stack = getLines(reason.stack)
    }
    lazyReportCache({
      type: 'error',
      subType: 'promiseError',
      pageURL: getPageURL(),
      startTime: e.timeStamp,
      position: `${lineno}:${colno}`,
      message,
      stack
    })
  })

  // 监听Vue错误
  if (config.vue?.Vue) {
    config.vue.Vue.config.errorHandler = (err, vm, info) => {
      console.error(err)

      lazyReportCache({
        type: 'error',
        subType: 'vueError',
        pageURL: getPageURL(),
        startTime: performance.now(),
        info,
        error: err.stack
      })
    }
  }

  onBFCacheRestore(() => {
    captureError()
  })
}
