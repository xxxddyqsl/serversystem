// C 层- 具体业务分层详细说明 在 业务分层-介绍说明.text 文件夹中 


//  api - 权限 处理
const rights =require('./rights/index')
//  api - 角色 处理
const roles =require('./roles/index');
//  api- 用户 处理
const users = require('./users/index');
// api- 区域 处理
const regions = require('./regions/index');
// api- 新闻 处理
const news = require('./news/index');
// api- 审核 处理
const audit = require('./audit/index');
// 操作数据库 - 发布 处理
const publish = require('./publish/index');
// 封装-C层（controller层只负责处理请求业务逻辑 不涉及操作数据库）
const apiController = {
    ...rights,
    ...roles,
    ...users,
    ...regions,
    ...news,
    ...audit,
    ...publish,
}
module.exports = apiController;