

// categories 表  新闻分类 字段说明
// {
//     id ，
//     title 
//     ，value
// }

//  news 表 字段说明
// {
//    title : "测试", // 新闻标题
//    categoryId:1,// 新闻分类 - 以id为标识
//   "content":'<p>测试</p>',// 新闻内容
//   "region":'',// 新闻发布的区域
//   "author":"admin",// 新闻发布的人
//   "authorId":1,// 新闻发布人id
//   "roleId":1,// 新闻发布人的角色权限id 对应 roles表
//   "auditState": 2, // 审核状态 0 默认状态未审核 说明是草稿 还没有审核  1 正在审核 2审核通过 3审核未通过
//   "publishState": 1,  //发布状态 0默认状态未发布 1待发布 2已上线 3已下线
//   "createTime": 1615780184222,  //新闻创建发布时间 时间戳
//   "star":0, //点赞数量
//   "view": 0, // 浏览量
//   "id":9 //
// comment: 0, // 评论数量
//      newsDele:0, 默认0 未被删除 1已删除
//     publishTime: 1615780184222, //发布时间  mysql中 时间戳 存入的类型为 bigint 性能最好，存储时间戳，不方便可视化，由自己自由转换时区，适合追求性能、国际化（时区转换）、不注重DB可视化的场景，还不用考虑时间范围，如果是短期不会超出2038年XX还可以使用空间更小的int整形
//   }
// mysql中 存储时间戳字段 各 类型的 介绍 https://zhuanlan.zhihu.com/p/661669714

// 导入连接 mysql数据库  返回的变量 - 操作数据库
const promisePool = require('../../config/db.config');
const publish = {
      //  获取 自己的 新闻待发布 列表
      publish: async ({ authorId, publishState }) => {
        //  join 联接 多表查询 roles表 categories表
        // auditState 审核状态 ： 大于等于 1 的数据 ，需要不是 0 草稿 的数据 //publishState 发布状态 ：  小于等于 1 的数据 ，需要 不是 2 、3 未发布上线的数据
        const data = await promisePool.query(`select n.*, 
            IF( COUNT(c.id) = 0,JSON_ARRAY(), CAST(
            GROUP_CONCAT( JSON_OBJECT('id', c.id,
            'title', c.title,
            'value', c.value ) ORDER BY  c.id)  as JSON) )  as category,

            IF( COUNT(r.id) = 0,JSON_ARRAY(), CAST(
                GROUP_CONCAT( JSON_OBJECT('id', r.id,
                    'roleName', r.roleName,
                    'roleType', r.roleType,
                    'rights', r.rights,
                    'rightsdele', r.rightsdele,
                    'disable', r.disable ) ORDER BY  r.id) as json ) )  as roles

            from news as n
            left JOIN categories c on c.id=n.categoryId

            left JOIN roles as r on roleId=r.id

            where  (n.authorId=${authorId}) and (n.newsDele != 1 )  and (n.publishState = ${publishState} )   GROUP BY n.id; `);
        return data;

    },
    // 审核新闻  -  查询 出来 所有 publishState 发布状态等于1 待发布的数据 - 这里 不会返回自己或者同级的 审核新闻数据  除非是 roleid 顶级权限 为1 超级管理员 返回所有 审核状态等于1的数据 
    // 并且  返回 小于当前 roleid (注意 roleid 顶级权限 为1 超级管理员 ，因此 大于roleid 权限就是小的权限 ) 权限的用户数据, 并且 roleid=1 查询所有区域的用户 否则返回  当前 级别 以下的同区域的用户
    // unpublished: async ({ auditState,roleid,region }) => {
    //     const data = await promisePool.query(`select n.*, 
    //     IF( COUNT(c.id) = 0,JSON_ARRAY(), CAST(
    //     GROUP_CONCAT( JSON_OBJECT('id', c.id,
    //     'title', c.title,
    //     'value', c.value ) ORDER BY  c.id)  as JSON) )  as category,

    //     IF( COUNT(r.id) = 0,JSON_ARRAY(), CAST(
    //         GROUP_CONCAT( JSON_OBJECT('id', r.id,
    //             'roleName', r.roleName,
    //             'roleType', r.roleType,
    //             'rights', r.rights,
    //             'rightsdele', r.rightsdele,
    //             'disable', r.disable ) ORDER BY  r.id) as json ) )  as roles

    //     from news as n
    //     left JOIN categories c on c.id=n.categoryId

    //     left JOIN roles as r on roleId=r.id

    //     where (n.auditState = ${auditState})  and (n.newsDele != 1 )  and ( n.roleid>=${roleid})
    //     and ( IF( 1 = ${roleid},
    //         n.roleid>=${roleid} , n.roleid>${roleid}  ) )
    //         and ( IF( 1 = ${roleid},
    //             n.roleid>=${roleid} , n.region = "${region}"  ) )

    //     GROUP BY n.id; `);
    //     // mysql IF 语句 解释说明
    //     // IF( 1 = ${roleid} 为true 时 执行语句1 否则 执行语句2,
    //         // n.roleid>=${roleid} 语句1 , n.region = "${region}" 语句2
    // return data;

    // }
}
module.exports = publish