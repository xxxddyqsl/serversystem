const koa = require('koa')
const app = new koa();
// 修正文件路径
const path = require('path')// 如 使用path.join(__dirname, 'public')为根据windows或Linux系统环境拼接的绝对路径
// 引入 静态资源模块管理
const static = require('koa-static')
// koa 获取 post 请求参数 需要导入 koa-bodyparser 模块  koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
const bodyParser = require('koa-bodyparser')
// 导入 自定义 封装的 路由模块
const router = require('./routers')
// 导入 自定义 封装 生成及校验 token 模块
const JWT = require('./util/JWT')
// 将 koa-bodyparser 模块 配置 注册成应用级中间件
app.use(bodyParser())// 解析获取前端 post请求 传入的参数

// 静态资源模块管理 配置注册 成 应用级中间件 - 测试是否能够获取到静态资源 访问：http://localhost:4399/html/home.html
app.use(static(
    path.join(__dirname, './public')// path.join 连接 __dirname（字符串指向当前正在执行脚本的）绝对路径 ，和 public （此时相对路径的文件夹）在根据windows或Linux系统环境拼接的绝对路径
))
// token 校验
// app(()=>{

// })

// 将 导入的路由 注册成 应用级中间件
app.use(router.routes()).use(router.allowedMethods())
module.exports = app;