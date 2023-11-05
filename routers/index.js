// 路由入口文件 ， 合并  封装的子路由

// 引入 koa 路由模块
const Router = require('koa-router')
// new 将路由模块 实例化
const router =new Router();

// 导入 子路由
const loginRouter = require('./login')

// 导入 子路由
const ApiRouter = require('./api')
// 将 loginRouter 注册 路由级中间件 ，并且 loginRouter 子路由 合并到 当前的 new 的router 创建的路由模块 中
router.use('/login',loginRouter.routes(),loginRouter.allowedMethods());
// 将 loginRouter 注册 路由级中间件 ，并且 loginRouter 子路由 合并到 当前的 new 的router 创建的路由模块 中
router.use('/api',ApiRouter.routes(),ApiRouter.allowedMethods());

// 导出 路由
module.exports = router