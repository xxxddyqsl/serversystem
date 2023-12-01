// 引入 koa 路由模块
const Router = require('koa-router');
const apiController = require('../../controllers/apiController')
// 引入 @koa/multer 因为@koa/multer 依赖于multer 处理前端传入文件时 数据的编码格式："multipart/form-data"
// const multer = require('@koa/multer');
// 配置 将上传的 文件 存在 'public/uploads/avatars/ 文件夹内 如果 uploads/avatars文件夹不存在 会自动创建 uploads/avatars文件夹
//  // const uploadAvatars  = multer({dest:'public/uploads/avatars/'}); // 该 文件夹为专门存放  头像的文件夹
//  优化 上传文件 文件夹创建 及其 路径+文件夹名 ，配置 上传的 文件 路径 +name 统一处理
const uploadController = require('../../controllers/uploadController')

// new 将路由模块 实例化
const router = new Router(); 
// 权限管理
// 获取权限列表
// apidoc 生成（根据注释生成文档） 接口文档注释  - 权限管理接口文档 开始

/**
 * 
 * @api {get} /rights 权限列表
 * @apiName rights
 * @apiGroup rightsgroup
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} id
 * 
 * @apiSuccess (200) {Number} Code 标识成功字段
 * 
 * @apiParamExample  {application/json; charset=utf-8} Request-Example:
 * {
 *     id : userId
 * }
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     Code : 0,
 *
 * }
 *
 * @apiSampleRequest true
 */
router.get('/rights', apiController.rights)
// 获取 获取权限列表 - 树

router.get('/rights/tree', apiController.rightsTree);
// 权限  - delete 方式 删除 
/**
 * 
 * @api {delete} /rights/:grade/:id 权限删除
 * @apiName rightsDelete
 * @apiGroup rightsgroup
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} grade
 * @apiParam  {String} id
 * 
 * @apiSuccess (200) {Number} Code 标识成功字段
 * 
 * @apiParamExample  {application/json; charset=utf-8} Request-Example:
 * {
 *      grade：1
 *     id : userId
 * }
 * @apiSuccessExample {type} Success-Response:
 * {
 *     Code : 0,
 *
 * }
 *
 * @apiSampleRequest true
 */

router.delete('/rights/:grade/:id', apiController.rightsDelete)
/**
 * 
 * @api {put} /rights/:grade/:id 权限修改
 * @apiName rightsUpdate
 * @apiGroup rightsgroup
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} grade
 * @apiParam  {String} id
 * 
 * @apiSuccess (200) {Number} Code 标识成功字段
 * 
 * @apiParamExample  {application/json; charset=utf-8} Request-Example:
 *  {
 *      grade：1
 *     id : userId
 * }
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     Code : 0,
 *
 * }
 *
 * @apiSampleRequest true
 */
// 权限 - put 方式 修改
router.put('/rights/:grade/:id', apiController.rightsUpdate)

// 角色管理
// 获取 角色列表
/**
 * 
 * @api {get} /roles 角色列表
 * @apiName roles
 * @apiGroup rolesgroup
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {Number} Code 标识成功字段
 * 
 * @apiParamExample  {application/json; charset=utf-8} Request-Example:
 *  {
 *      
 *    
 * }
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     Code : 0,
 *
 * }
 *
 * @apiSampleRequest true
 */
router.get('/roles', apiController.roles);

// 删除 角色
/**
 * 
 * @api {delete} /roles 删除角色
 * @apiName rolesDelete
 * @apiGroup rolesgroup
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} id
 * 
 * @apiSuccess (200) {Number} Code 标识成功字段
 * 
 * @apiParamExample  {application/json; charset=utf-8} Request-Example:
 * {
 * }
 * @apiSuccessExample {type} Success-Response:
 * {
 *     Code : 0,
 *
 * }
 *
 * @apiSampleRequest true
 */
router.delete('/roles', apiController.rolesDelete)
//   put 方式 修改
router.put('/roles', apiController.rolesUpdate)

// 用户管理 -获取列表
router.get('/users', apiController.users);
// 用户管理 添加用户
router.post('/users', apiController.usersAdd);
router.delete('/users', apiController.usersDelete);
//  用户管理 修改用户状态 
router.patch('/users', apiController.usersSetData)

// 区域管理
router.get('/regions', apiController.regions);

// 新闻管理 - 获取指定 新闻id的新闻
router.get('/news/:id', apiController.newsId);
// 获取 所有发布的 新闻 desc 从大到小 降序 返回
router.get('/newsDesc', apiController.newsDesc);
// 统计出 每个新闻类型 如 已发布的 数量 
router.get('/newsCount', apiController.newsCount);
 // 获取 所有发布的 新闻 列表
router.get('/newsList', apiController.newsList);

// 新闻管理 - 获取新闻类别
router.get('/newsCategories', apiController.categories);
//  新闻管理 - 修改新闻类别
router.patch('/newsCategories', apiController.categoriesSetData);
//  新闻管理 - 添加新闻类别
router.post('/newsCategories', apiController.categoriesAdd);
//  新闻管理 - 删除新闻类别 - 假删除 修改状态
router.delete('/newsCategories', apiController.categoriesSetData);

// 新闻管理 -  添加-保存草稿  auditState 0 保存草稿 || auditState 1 提交审核
router.post('/newsSavedraft', apiController.saveDraft);
// 新闻管理 -  获取草稿列表
router.get('/newsDrafts', apiController.drafts);
// 新闻管理 - 修改新闻内容或状态
router.patch('/news/:id', apiController.newsSetData);

// 新闻管理 -  删除
router.delete('/news', apiController.newsDele);

// 审核管理 - 获取审核列表
router.get('/audit', apiController.auditList);
// 审核管理 - 获取审核新闻
router.get('/auditNews', apiController.auditNews);

// 发布管理 - 获取 待发布 根据参数状态 返回   （0默认状态未发布 1待发布 2已上线 3已下线）  列表
router.get('/publish', apiController.publish);


/*
uploadAvatars.single('avatar') 为单个文件
 put 请求为 修改数据 增加了文件上传 - - 可上传多个文件 array
 uploadAvatars.array('avatar') 为多个文件 - 无限制上传文件数量
 如果想要限制上传的数量 uploadAvatars.array('avatar',5)最多5个文件
其他说明解析  44-nodejs-express-文件上传-01 routes文件夹下的api.js 中可见
 
注意 single('avatar') 内的 avatar 为 formData 内的文件 key 前端如：let formData = new FormData();  formData.append('avatar', files[0]);
*/

// 上传管理 - 个人信息-头像image
router.post('/useInfo',uploadController.uploadsPath({dirName:'avatars'}).single('avatar'), apiController.useInfo);
// router.post('/useInfo',uploadAvatars.single('avatar'), apiController.uploads.useInfo);
// router.use('/useInfo',apiController. routes(),ApiRouter.allowedMethods());
router.post('/uploadNewsImage',uploadController.uploadsPath({dirName:'newsImages'}).single('newsImages'), apiController.uploadNewsImage);

// 游客访问 接口
router.get('/tourist/newsList', apiController.newsList);
router.get('/tourist/news/:id', apiController.newsId);
router.patch('/tourist/news/:id', apiController.newsSetData);

 

module.exports = router