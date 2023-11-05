// 具体业务分层详细说明 在 业务分层-介绍说明.text 文件夹中

// 导入连接 mysql数据库  返回的变量 - 操作数据库
const promisePool = require('../config/db.config');

// 封装- M层 model 只操作数据库  C层 分配业务-  返回数据
// 当前文件夹 为M层 model 应该创建一个文件夹 model 专门存在处理  增、删、改、查 
const loginModel = {
    login: async (username, password) => {
        // 联表查询    inner join 方式 只能 查询出来 两个表 有关联性的的 数据 如 students 表内的name 和 users 表内的 name相同
        // const data = await promisePool.query(`select * from students s inner join users u on s.name=u.name  where ( s.name=? ) and ( u.password=? ) ;`, [ username , password]);
        // 语句： select from 表名 别名 inner join（联表查询方式） on（条件）  where 过滤条件
        // return data;
        return  [111]
    },
}
module.exports = loginModel;