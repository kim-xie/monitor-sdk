import captureError from './error/index'
import capturePerformance from './performance/index'
import captureBehavior from './behavior/index'
import captureInterface from './interface/index'
import config, { setConfig } from './config'
import { onBeforeunload, onHidden } from './utils/utils'
import { report } from './utils/report'
import { getCache, clearCache } from './utils/cache'

const monitor = {
  init(options = {}) {
    setConfig(options)
    const { injectError, injectInterface, injectPerformance, injectBehavior } = config
    if (injectError) {
      captureError()
    }
    if (injectInterface) {
      captureInterface()
    }
    if (injectPerformance) {
      capturePerformance()
    }
    if (injectBehavior) {
      captureBehavior()
    }

    // 当页面进入后台或关闭前时，将所有的 cache 数据进行上报
    const eventList = [onBeforeunload, onHidden]
    eventList.forEach(fn => {
      fn(() => {
        const data = getCache()
        if (data.length) {
          report(data, true)
          clearCache()
        }
      })
    })
    setTimeout(() => {
      console.log('→ monitor sdk init success')
    })
  },
  report
}

export default monitor
