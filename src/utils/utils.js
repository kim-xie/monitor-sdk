export function deepCopy(target) {
  if (typeof target === 'object') {
    const result = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (typeof target[key] === 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }

    return result
  }

  return target
}

export function onBFCacheRestore(callback) {
  window.addEventListener(
    'pageshow',
    event => {
      if (event.persisted) {
        callback(event)
      }
    },
    true
  )
}

export function onBeforeunload(callback) {
  window.addEventListener('beforeunload', callback, true)
}

export function onHidden(callback, once) {
  const onHiddenOrPageHide = event => {
    if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
      callback(event)
      if (once) {
        window.removeEventListener('visibilitychange', onHiddenOrPageHide, true)
        window.removeEventListener('pagehide', onHiddenOrPageHide, true)
      }
    }
  }

  window.addEventListener('visibilitychange', onHiddenOrPageHide, true)
  window.addEventListener('pagehide', onHiddenOrPageHide, true)
}

export function executeAfterLoad(callback) {
  if (document.readyState === 'complete') {
    callback()
  } else {
    const onLoad = () => {
      callback()
      window.removeEventListener('load', onLoad, true)
    }

    window.addEventListener('load', onLoad, true)
  }
}

export function getPageURL() {
  return window.location.href
}

// 格式化栈信息
export const getLines = stack =>
  stack
    .split('\n')
    .slice(1)
    .map(item => item.replace(/^\s+at\s+/g, ''))
    .join('^')

// 获取最后一个交互事件
export const getLastEvent = () => {
  let lastEvent = null
  const eventList = ['click', 'touchstart', 'mousedown', 'keydown', 'mouseover']
  eventList.forEach(eventType => {
    document.addEventListener(
      eventType,
      event => {
        lastEvent = event
      },
      {
        capture: true, // 捕获阶段
        passive: true // 默认不阻止默认事件
      }
    )
  })
  console.log('lastEvent', lastEvent)
  return lastEvent
}

// 获取元素选择器
export const getSelectors = pathsOrTarget => {
  function getSelector(path) {
    return path
      .reverse()
      .filter(ele => ele !== document && ele !== window)
      .map(ele => {
        let selector = ''
        if (ele.id) {
          return `${ele.nodeName.toLowerCase()}#${ele.id}`
        }
        if (ele.className && typeof ele.className === 'string') {
          return `${ele.nodeName.toLowerCase()}.${ele.className}`
        }
        selector = ele.nodeName.toLowerCase()

        return selector
      })
      .join(' ')
  }
  if (Array.isArray(pathsOrTarget)) {
    return getSelector(pathsOrTarget)
  }
  const paths = []
  while (pathsOrTarget) {
    paths.push(pathsOrTarget)
    pathsOrTarget = pathsOrTarget.parentNode
  }
  return getSelector(paths)
}
