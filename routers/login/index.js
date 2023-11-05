// 引入 koa 路由模块
const Router = require('koa-router');
// const loginController = require('../../controllers/loginController')

// new 将路由模块 实例化
const router =new Router();

router.post('/', async (ctx,next)=>{
   // 获取到的是 { username: '小明', password: '123123' }
  //  const { username, password } = ctx.request.body;
  console.log(ctx.request.body)
    ctx.body = {Code: 0,Message:'测试'};
})


module.exports = router