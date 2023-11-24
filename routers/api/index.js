// 引入 koa 路由模块
const Router = require('koa-router');
const apiController = require('../../controllers/apiController')

// new 将路由模块 实例化
const router = new Router();

// 权限管理
// 获取权限列表
router.get('/rights', apiController.rights)
// 获取 获取权限列表 - 树
router.get('/rights/tree', apiController.rightsTree);
// 权限  - delete 方式 删除 
router.delete('/rights/:grade/:id', apiController.rightsDelete)
// 权限 - put 方式 修改
router.put('/rights/:grade/:id', apiController.rightsUpdate)

// 角色管理
// 获取 角色列表
router.get('/roles', apiController.roles);

// 删除 角色
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

// 发布管理 - 获取 待发布 赶紧参数状态 返回   （0默认状态未发布 1待发布 2已上线 3已下线）  列表
router.get('/publish', apiController.publish);

module.exports = router