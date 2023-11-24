// 具体业务分层详细说明 在 业务分层-介绍说明.text 文件夹中

// 导入连接 mysql数据库  返回的变量 - 操作数据库
// const promisePool = require('../config/db.config');
 
//  操作数据库 - 权限 处理
const rights =require('./rights/index')
//  操作数据库 - 角色 处理
const roles =require('./roles/index')
// 操作数据库 - 用户 处理
const users =require('./users/index')
// 操作数据库 - 区域处理
const regions =require('./regions/index')
// 操作数据库 - 新闻 处理
const news = require('./news/index');
// 操作数据库 - 审核 处理
const audit = require('./audit/index');
// 操作数据库 - 发布 处理
const publish = require('./publish/index');
const apiModel = {
  ...rights,
  ...roles,
  ...users,
  ...regions,
  ...news,
  ...audit,
  ...publish,
}
module.exports = apiModel;