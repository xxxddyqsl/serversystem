// 连接数据库 - // 导入 操作连接 mysql 数据库的 第三方 库
const mysql2 = require('mysql2')
// 连接数据库的 配置
function getDBConfig(){
    return {
        host:'127.0.0.1',// 域名 当前为本地的 127.0.0.1
        user:'root',// 用户名 当前是使用的默认 root
        port:3306, // 端口号 默认的端口号
        // password:'',
        password:'5334719', // 密码 默认的密码为 空 ，可以不写，当前是设置了 密码的
        database:'system',//连接的 数据库名称 （ 前面创建的数据库名）
        connectionLimit:1,//创建一个连接池 可以创建多个连接池 （就是多进程  connectionLimit:2,）
        // connectionLimit:4,// 有些情况下 可以创建多个连接池 如完了响应 创建 多进程 多个连接池
    }
}
// 获取 连接数据库的 配置
const confing  = getDBConfig();
// 创建连接池，传入连接配置 进行 操作
const promisePool= mysql2.createPool(confing).promise();// 返回的东西是 基于 promise的
// 导出
module.exports = promisePool;