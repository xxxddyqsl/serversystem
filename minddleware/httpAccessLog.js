// 自定义中间件 - 处理 http访问请求日志
const log4js=require('../logger/index')
const httpLogger=log4js.getLogger('httpLog');
function  httpAccessLog(ctx,next){
    // console.log(ctx)
    const logStr=`path:${ctx.path} | method:${ctx.method} | status:${ctx.status} | userAgent:${ctx.headers['user-agent']} | message: ${ctx.message}`
    // 写入
    httpLogger.info(logStr)

    // 放行
    return next();
}

module.exports = httpAccessLog