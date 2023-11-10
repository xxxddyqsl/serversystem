//对于 users 表 内字段的解释说明
// {
//     id,
//     username,
//     password,
//     rolestate, 表示用户状态 是否打开 开关 1 (为真) 打开 0 (为假)关闭
//     default, 表示 用户 默认 1表示默认不可删除 0 可删除
//     region, 表示 用户 负责的区域 ， 为空字符串时 是全球
//     roleid,表示 超级管理员 区域管理员   区域编辑的 id 对应 rols表中的 roleType 字段
//     dele, 1  表示已经被删除 0 默认值未被删除

// 导入连接 mysql数据库  返回的变量 - 操作数据库
const promisePool = require('../../config/db.config');
const users = {
    // 获取用户列表 返回 小于等于当前roleid权限的用户数据, 并且 roleid=1 查询所有区域的用户 否则返回 同级及以下的同区域的用户
    users: async (roleid,region) => {
        // let data = await promisePool.query(`SELECT u.*,r.* as roles  FROM users as u left join roles as r on u.roleid =r.id;`)
        let data = await promisePool.query(`SELECT u.*, IF( COUNT(r.id) = 0,JSON_ARRAY(), CAST(
        GROUP_CONCAT( JSON_OBJECT('id', r.id,
             'roleName', r.roleName,
             'roleType', r.roleType,
                       'rights', r.rights,
             'disable', r.disable ) ORDER BY  r.id) as json ) )  as roles FROM users  u LEFT JOIN roles  r on u.roleid =r.id  where (u.dele != 1) and ( u.roleid>=${roleid}) 
             and ( IF( 1 = ${roleid},
                u.roleid>=${roleid} , u.region = "${region}"  ) )  GROUP BY u.id;
        `)
        return data[0];
    },
    // 获取指定 id 的 用户信息
    getUserId: async(id)=>{
        let dataItem = await promisePool.query(`SELECT u.*, IF( COUNT(r.id) = 0,JSON_ARRAY(), CAST(
            GROUP_CONCAT( JSON_OBJECT('id', r.id,
                 'roleName', r.roleName,
                 'roleType', r.roleType,
                 'rights', r.rights,
                 'rightsdele', r.rightsdele,
                 'disable', r.disable ) ORDER BY  r.id) as json ) )  as roles FROM users  u LEFT JOIN roles  r on u.roleid =r.id where (u.id = ${id}) GROUP BY u.id;
            `);
            return dataItem[0];
    },
    usersAdd: async (body) => {
        let { username,password,region,roleid,rolestate,} = body
        // default 为 关键字 无法直接解构
        let newdefault = body.default;
        //  命令： insert into 数据表名称([字段1,字段2,字段3...]) values (字段1的值,字段2的值,字段3的值.....);
        // 注意 字段 default 为 mysql的关键字 需要通过 `default` 包裹 否则mysql 无法分辨是字段 还是关键字
        let data =  await promisePool.query('insert  into users(username,password,region,roleid,rolestate, `default`) values (?,?,?,?,?,?); ',[''+username+'',''+password+'',''+region+'',roleid,rolestate,newdefault]);
        //    insertId 为 返回的插入数据成功的 自增 id 
        let {insertId}=data[0];
        // 联表查询 获取 角色的权限 并且 根据 insertId 获取 插入成功的 数据
        let dataItem = await users.getUserId(insertId)
        return dataItem[0];
    },
    usersDelete: async (id) => {
        // 假删除 - 修改字段状态
        let data = await promisePool.query(`update users set dele=1 where id=${id};`)
        // 真删除 
        // delete from 数据表名称 [where 删除条件];
        // let data = await promisePool.query(`delete from users  where id=${id};`)
        // console.log(data)
        return data[0];
    },
    usersSetData: async (id,set) => {
        console.log(id,set)
        // 获取修改字段的key
        let nameArr = Object.keys(set);
        // 第一种是正则表达式来判断，判断输入的字符中是否包含中文。
        let reg = new RegExp("[\\u4E00-\\u9FFF]+",'g');
        // 拼接 字段 +修改的value 返回数组 join 转字符串,分割 字段包含中文 添加引号 如字符串 为空 赋值 空的""
        let msg=nameArr.map((item)=>`${item}=${reg.test(set[item])?'"'+set[item]+'"':(typeof set[item] == 'string'&&set[item]== '')? '""':set[item]}`).join(',');
        console.log(msg)
        //   修改字段状态
        let data = await promisePool.query(`update users set ${msg} where id=${id};`)
        // /联表查询 获取 角色的权限 并且 根据 insertId 获取 插入成功的 数据
        let dataItem = await users.getUserId(id);
        return dataItem[0];
    },
}
module.exports = users
