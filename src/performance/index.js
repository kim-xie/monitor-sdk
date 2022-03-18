import observeEntries from './observeEntries'
import observePaint from './observePaint'
import observeLCP from './observeLCP'
import observeCLS from './observeCLS'
import observeFID from './observeFID'
import observerLoad from './observerLoad'
import observeFirstScreenPaint from './observeFirstScreenPaint'
import fps from './fps'
import onVueRouter from './onVueRouter'
import config from '../config'

export default function capturePerformance() {
  observeEntries()
  observePaint()
  observeLCP()
  observeCLS()
  observeFID()
  fps()
  observerLoad()
  observeFirstScreenPaint()

  if (config.vue?.Vue && config.vue?.router) {
    onVueRouter(config.vue.Vue, config.vue.router)
  }
}
