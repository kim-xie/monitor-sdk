// 初始配置
const config = {
  url: '', // 数据上报的服务器地址
  appID: '', // 项目ID
  userID: '', // 用户ID
  projectName: '', // 项目名称
  debug: true, // 是否开启调试模式（日志打印）
  reportMode: 'sendBeacon', // 数据上报方式: sendBeacon | xhr | gif
  injectError: true, // 监听错误
  injectBehavior: false, // 监听用户行为
  injectPerformance: false, // 监听性能
  injectInterface: true, // 监听接口
  vue: {
    // Vue及路由配置
    Vue: null,
    router: null
  }
}

export default config

export function setConfig(options) {
  for (const key in config) {
    if (options[key]) {
      config[key] = options[key]
    }
  }
}
