// C 层- 具体业务分层详细说明 在 业务分层-介绍说明.text 文件夹中 

// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const loginModel = require('../model/loginModel');
const JWT = require('../util/JWT');
// 封装-C层（controller层只负责处理请求业务逻辑 不涉及操作数据库）
const loginController = {
    login: async (ctx, next) => {
        /*
            post 请求获取参数
            koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
        */
        // 获取到的是 { username: '小明', password: '123123' }
        const { username, password } = ctx.request.body;
        console.log('login',username, password);
        // M层 model 操作数据库 并且返回数据
        const users = await loginModel.login(username, password);
        console.log(users)
        let data=null;
        // 账号密码存在
        if(users[0]){
            // 用户状态 0 说明登录状态为假 禁止登录
            if(users[0].rolestate == 0){
                ctx.status=403;
                data={ Code: -1,Message:`暂无权限` };
            }
            else if(users[0].roles.disable!=1){
                ctx.status=403;
                data={ Code: -1,Message:`暂无该角色` };
            }
            else{
                let obj = users[0];
               // 登录成功 生成token data[0]加密数据   过期时间-字符串类型(默认毫秒 1000*60 = 1分钟 1000*60*60=1小时 ，或'10s'=>10秒 或'1h'=>1小时 或 '1d'=>1天  )
               const token =JWT.generate(obj,(1000*60*5).toString());// 过期时间 5 分钟
                //  headers 里 设置 token
               ctx.set('Authorization',token)
                // 过滤 password密码
               const newCar = Object.keys(obj).reduce((object, key) => {
                if (key !== 'password') {
                  object[key] = obj[key]
                }
                return object
              }, {})
               data = {Code:0,Data:{...newCar},Message : "login - 登录成功"}
            }

        }else{
            data={ Code: -1,Message:`账号密码错误` };
        }
        ctx.body = data
    },
    // 退出登录 - 销毁 session
    logout: (ctx, next) => {
        // 销毁 session
        //     req.session.destroy(()=>{// 销毁成功 触发 回调
        //         // 销毁成功 - 给前端 返回数据
        ctx.body = { Code: 0, Message: '退出登录成功' };
        // });
    },
}
module.exports = loginController;