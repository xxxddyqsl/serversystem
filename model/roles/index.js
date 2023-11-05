// 导入连接 mysql数据库  返回的变量 - 操作数据库
const promisePool = require('../../config/db.config');
const roles= {
    // C 层 调用 M层操作数据库
    roles: async () => {
        // 获取角色表 - JSON_ARRAY(r.rights ) as rights 字符串 转 数组 设置别名 rights
        // let data = await promisePool.query(`SELECT  r.*, SUBSTRING_INDEX(r.rights, ',', ( LENGTH(r.rights) - LENGTH(REPLACE(r.rights,',','')) )) as rights FROM roles as r;`)
        // let data = await promisePool.query(` SELECT r.*, CONCAT('[',GROUP_CONCAT( rights ),']') as a FROM roles as r  GROUP BY r.id; `)
        // 查询 disable字段：不为空的数据，可以使用IS NOT NULL条件
        let data = await promisePool.query('SELECT *  FROM roles where  `disable`  IS NOT NULL;')
        return data[0];
    },
    rolesDelete: async ({id}) => {
        // 删除角色 - 修改  disable 字段 1 可用 null 为删除禁止使用
        let data = await promisePool.query(`update roles set disable=null where id=${id};`)
        return data[0];
    },
    rolesUpdate: async ({id,rights}) => {
        // 角色权限 - 修改  rights 字段    - '${rights}' 注意 引号
        let data = await promisePool.query(`update roles set rights = '${rights}' where id = ${id} ;`)
        return data[0];
    },
}
module.exports = roles;