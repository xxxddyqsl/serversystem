const koa = require('koa')
const app = new koa();
// 修正文件路径
const path = require('path')// 如 使用path.join(__dirname, 'public')为根据windows或Linux系统环境拼接的绝对路径
// 引入 静态资源模块管理
const static = require('koa-static')
//  导入 koa-views 模块 - ejs
const views = require('koa-views');
// koa 获取 post 请求参数 需要导入 koa-bodyparser 模块  koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
const bodyParser = require('koa-bodyparser')
// 导入 自定义 封装的 路由模块
const router = require('./routers')
// 导入 自定义 封装 生成及校验 token 模块
const JWT = require('./util/JWT')
// 处理 http 访问日志 自定义中间件
const httpAccessLog = require('./minddleware/httpAccessLog')

 

// 第三方 错误处理模块
var jsonError = require('koa-json-error');
// 将 koa-bodyparser 模块 配置 注册成应用级中间件
app.use(bodyParser())// 解析获取前端 post请求 传入的参数
// 处理 http 访问日志 自定义中间件注册成应用级中间件
app.use(httpAccessLog)
// 静态资源模块管理 配置注册 成 应用级中间件 - 测试是否能够获取到静态资源 访问：http://localhost:4399/html/home.html
app.use(static(
    path.join(__dirname, './build')// path.join 连接 __dirname（字符串指向当前正在执行脚本的）绝对路径 ，和 public （此时相对路径的文件夹）在根据windows或Linux系统环境拼接的绝对路径
))

// 静态资源模块管理 配置注册 成 应用级中间件 - 测试是否能够获取到静态资源 访问：http://localhost:4399/html/home.html
app.use(static(
    path.join(__dirname, './public')// path.join 连接 __dirname（字符串指向当前正在执行脚本的）绝对路径 ，和 public （此时相对路径的文件夹）在根据windows或Linux系统环境拼接的绝对路径
))
//  配置 ejs 模板引擎 配置 注册成应用级中间件 
app.use(views(path.join(__dirname, './build'),// views文件夹路径
// app.use(views(path.join(__dirname, './views'),// views文件夹下的home.html 路径http://localhost:4399/home.html
    {
        extension: 'ejs',//  调用 通过 ejs 引擎来解析 html模板页 build 文件夹下的 index.html  如：http://localhost:4399/index.html
    }
))
// 注册  - 第三方 错误处理模块 注册中间件(防止程序宕机 ， 告诉用户错误信息)
app.use(jsonError())


// token 校验
app.use(async (ctx, next) => {
    // console.log('token===>',ctx.headers['authorization'],ctx.url)
    // 排除 login登录相关的接口和路由 + 排除 tourist 游客相关的接口和路由 的  token 身份校验
    if (ctx.url.includes('login') || ctx.url.includes('tourist')) {
          // koa 对于前端路由处理 -ctx.render 异步读取并且渲染文件 直接返回 index.html 让前端自己处理 ，注意 配置 ejs 模板（可加载 html） 和 配置static 静态资源文件
          await  ctx.render('/index.html')
        // 调用 下一个 中间件
        await next()
        // 控制器回来 后面的代码 不在执行
        return
    }
    /*
   获取 前端传入的 token  token字段（前后端 共同约定的：Authorization）
   前端在给后端 传入 token 时 有一个不成文的规定 就是拼接上 Bearer+空格+ token ，当然不这么写 也是可以 只是推荐这样写，所以需要截取 空格之后的 token
   ctx.headers['authorization']? es6 语法 前面header头里面包含authorization字段时（header 里面小写） 为真时 才能 截取字符串（空格之后的） 获取 token,
 */
    let token = ctx.headers['authorization']?.split(' ')[1];
    /*
   手动模拟测试token失效 ： 手动删除 localStorage 里的token  前端传入头的token ( authorization: 'Bearer null') 字符串截取出来的 为 'null' string类型 ，
    token为字符串 'null' 不为假 进入校验token ，JWT.verify(token) 校验不通过返回 false ，给前端返回 错误码 401 及 数据
 */
    // console.log('应用级中间件=>',  token,ctx.url.includes('/api'))
    //  token 为真 或者url 包含 api的接口请求  说明前端发起 请求的api 接口必须携带token
    if (token || ctx.url.includes('/api')) {
        // 校验token
        const payload = JWT.verify(token);
        // console.log('校验token', payload)

        if (payload) {
            // 未过期 - 有效 token，重新计算token 过期时间  重新生成token { _id username }加密数据   过期时间-字符串类型(默认毫秒 1000*60 = 1分钟 1000*60*60=1小时 ，或'10s'=>10秒 或'1h'=>1小时 或 '1d'=>1天  )
            // const newToken= JWT.generate({_id:payload._id,username:payload.username},(1000*60*5).toString());// 重新计算 过期时间 5 分钟
            const newToken = JWT.generate({ _id: payload._id, username: payload.username }, (1000 * 60 * 60).toString());// 重新计算 过期时间 60 分钟
            /*  建议：默认不成文的规范
              后端返回 token时 放在header中 如： ctx.set(自定义字段名，value) // 通常 token的 字段名为 authorization 如下
              设置 token 的 字段名 必须前后端 约定好 使用同一个字段
              前端传入 token时 也是放在header中
            */
            ctx.set('Authorization', newToken)
            // 调用 next() 放行 直接执行 下一个中间件
            await next()
        } else {
            // console.log('过期 - 无效toke')
            // 过期 - 无效toke
            ctx.status = 401;// 设置 错误码
            ctx.body = { Code: -1, Message: 'token 登录令牌已过期，请重新登录' };
            // session 失效 后端渲染模板 - 路由重定向
            // ctx.redirect('/login')
        }

    } else {
        console.log('路由1=>',)
        //  token 为假 说明并且传入 token 访问的是路由页面
        // koa 对于前端路由处理 -ctx.render 异步读取并且渲染文件 直接返回 index.html 让前端自己处理 ，注意 配置 ejs 模板（可加载 html） 和 配置static 静态资源文件
        await  ctx.render('/index.html')
        // 调用 next() 放行 直接执行 下一个中间件
        await next();
    }
})

// 将 导入的路由 注册成 应用级中间件
app.use(router.routes()).use(router.allowedMethods())
// 注册  - 自定义的 错误中间件(防止程序宕机 ， 告诉用户错误信息) 渲染 error.ejs 模板页
// app.use(async (ctx, next) => {
//     console.log(ctx)
//         let message = ctx.response.message;
//         let error = ctx.app.env === 'development' ? ctx : {};
//         console.log(ctx.response.status)
//         // 设置 状态码
//         ctx.response.status = ctx.response.status || 500;
//         // 渲染 自定义 error.ejs 模板页 + 传入错误信息数据
//        await ctx.render('error',{message,error})
// });
module.exports = app;


/*
注意 pm2 需要全局安装
    使用 pm2 是node进程管理工具 ，项目 部署上线 使用pm2 进行启动管理项目
    "prd": "pm2 start ./bin/www", 启动
    "prdstop": "pm2 stop all", 停止
    "prdlist": "pm2 list" 查询启动的列表
*/