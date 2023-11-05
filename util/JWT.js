// 公共方法 - 生成 + 校验 token


// 导入第三方 库 生成 token 与 验证 token 需要配置 在应用级中间件
const jwt = require('jsonwebtoken')
const seceret = 'xing-anydata';// 先写一个 固定密钥 ，后续改成随机生成数字 并存入数据库

const JWT = {
    // 生成 token
    generate: (data, expires) => {
        // jwt.sign(加密数据,密钥,过期时间{})
        return jwt.sign(
            data,
            seceret,
            {
                expiresIn: expires,//过期时间 - 默认毫秒 1000*60 = 1分钟 1000*60*60=1小时
            }
        )
    },
    // 校验 token
    verify:(token,)=>{
         // 使用 try catch 捕获报错
         try {
            // 如果 token 未过期 返回一个对象 判断就是 true 否则catch 捕获报错 过期会返回报错, 手动返回 false
            return jwt.verify(token,seceret)
        } catch (error) {
            return false;
        }
    }
}
// 导出
module.exports = JWT ;