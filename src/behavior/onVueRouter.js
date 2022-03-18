import { lazyReportCache } from '../utils/report'
import { getUUID } from './utils'
import { getPageURL } from '../utils/utils'

export default function onVueRouter(router) {
  router.beforeEach((to, from, next) => {
    // 首次加载页面不用统计
    if (!from.name) {
      return next()
    }

    const data = {
      params: to.params,
      query: to.query
    }

    lazyReportCache({
      type: 'behavior',
      subType: ['vue-router-change', 'pv'],
      pageURL: getPageURL(),
      startTime: performance.now(),
      name: to.name || to.path,
      from: from.fullPath,
      to: to.fullPath,
      uuid: getUUID(),
      data
    })

    next()
  })
}
