import { originalOpen, originalSend } from './xhr'
import { addCache, getCache, clearCache } from './cache'
import generateUniqueID from './generateUniqueID'
import config from '../config'
import './browser'

let timer = null
const uaInfo = new Browser()
const sessionID = generateUniqueID()

// 是否支持SendBeacon
export function isSupportSendBeacon() {
  return !!window.navigator?.sendBeacon
}

// xhr上报
export function reportWithXHR(url, data) {
  const xhr = new XMLHttpRequest()
  originalOpen.call(xhr, 'post', url || config.url)
  originalSend.call(xhr, data)
}

// gif上报
export function reportWithGif(url, data) {
  const gifImage = new Image()
  gifImage.src = `${url}/monitor.gif?data=${data}&${Math.random()} `
}

// sendBeacon > gif
const defaultSend = isSupportSendBeacon()
  ? window.navigator.sendBeacon.bind(window.navigator)
  : reportWithGif

// 上报方式：默认情况 sendBeacon > gif > xhr
const sendData = () => {
  switch (config.reportMode) {
    case 'sendBeacon':
      return defaultSend
    case 'xhr':
      return reportWithXHR
    case 'gif':
      return reportWithGif
    default:
      return defaultSend
  }
}

// 上报可设定优先级
export function report(data, isImmediate = false) {
  if (!config.url) {
    console.error('请设置日志上报的服务器URL地址')
    return
  }

  // 公共参数
  const getExtraData = () => ({
    id: sessionID,
    title: document.title,
    appID: config.appID,
    userID: config.userID,
    projectName: config.projectName,
    reportMode: config.reportMode,
    userAgent: uaInfo,
    timestamp: Date.now()
  })

  // 上报参数
  const reportData = JSON.stringify({
    ...getExtraData(),
    data
  })

  const reportMode = sendData()

  // 立马上报
  if (isImmediate) {
    if (config.debug) {
      console.log('reportData ===> ', reportData)
    }
    reportMode(config.url, reportData)
    return
  }

  // 浏览器空闲上报
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        if (config.debug) {
          console.log('reportData ===> ', reportData)
        }
        reportMode(config.url, reportData)
      },
      { timeout: 3000 }
    )
  } else {
    setTimeout(() => {
      if (config.debug) {
        console.log('reportData ===> ', reportData)
      }
      reportMode(config.url, reportData)
    })
  }
}

// 延迟上报
export function lazyReportCache(data, timeout = 3000) {
  addCache(data)
  clearTimeout(timer)
  timer = setTimeout(() => {
    const cacheData = getCache()
    if (cacheData.length) {
      report(cacheData)
      clearCache()
    }
  }, timeout)
}
