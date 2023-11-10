// 导入连接 mysql数据库  返回的变量 - 操作数据库
const promisePool = require('../../config/db.config');
const roles= {
    // C 层 调用 M层操作数据库
    roles: async () => {
        // 获取角色表 - JSON_ARRAY(r.rights ) as rights 字符串 转 数组 设置别名 rights
        // let data = await promisePool.query(`SELECT  r.*, SUBSTRING_INDEX(r.rights, ',', ( LENGTH(r.rights) - LENGTH(REPLACE(r.rights,',','')) )) as rights FROM roles as r;`)
        // let data = await promisePool.query(` SELECT r.*, CONCAT('[',GROUP_CONCAT( rights ),']') as a FROM roles as r  GROUP BY r.id; `)
        // 查询 disable 字段：不为空的数据，可以使用IS NOT NULL条件
        let data = await promisePool.query('SELECT *  FROM roles where  `disable`  IS NOT NULL;')
        return data[0];
    },
    rolesDelete: async ({id}) => {
        // 删除角色 - 修改  disable 字段 1 可用 null 为删除禁止使用
        let data = await promisePool.query(`update roles set disable=null where id=${id};`)
        return data[0];
    },
    rolesUpdate: async ({id,set}) => {
         // 获取修改字段的key
         let nameArr = Object.keys(set);
         // 第一种是正则表达式来判断，判断输入的字符中是否包含中文。
         let reg = new RegExp("[\\u4E00-\\u9FFF]+",'g');
         // 拼接 字段 +修改的value 返回数组 join 转字符串,分割 字段包含中文 添加引号 如字符串 为空 赋值 空的""
         let msg=nameArr.map((item)=>`${item}=${reg.test(set[item])?'"'+set[item]+'"':(typeof set[item] == 'string'&&set[item]== '')? '""':'"'+set[item]+'"'}`).join(',');
         console.log('rolesUpdate=>',msg,set)
        // 角色权限 - 修改  rights 字段    - '${rights}' 注意 引号
        let data = await promisePool.query(`update roles set ${msg} where id = ${id} ;`)
        return data[0];
    },
}
module.exports = roles;