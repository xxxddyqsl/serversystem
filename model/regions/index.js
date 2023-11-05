//对于 regions 表 内字段的解释说明
// {
//     id,
//     title,
//     value,
// }

// 导入连接 mysql数据库  返回的变量 - 操作数据库
const promisePool = require('../../config/db.config');
const regions = {
    regions: async () => {
        let data = await promisePool.query(`SELECT  * FROM regions  ;`)
        return data[0];
    }
}
module.exports = regions