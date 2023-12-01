// 引入 koa 路由模块
const Router = require('koa-router');
const loginController = require('../../controllers/loginController')

// new 将路由模块 实例化
const router =new Router();

// apidoc 生成（根据注释生成文档） 接口文档注释  - 注册接口文档 开始 -    命令： apidoc -i .\routes\ -o .\doc 生成后面 在doc 文件夹中 打开 （双击） index.html 
/**
 * 
 * @api {post} /login 用户登录
 * @apiName login
 * @apiGroup logingroup
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} username 用户名
 * @apiParam  {String} password 密码
 * 
 * @apiSuccess (200) {Number} Code 标识成功字段
 * 
 * @apiParamExample  {application/json} Request-Example:
 * {
 *     username : '小明',
 *     password : '123456',
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     Code : 0,
 *
 * }
 *
 * @apiSampleRequest true
 */
// 登录
router.post('/', loginController.login)



module.exports = router