
// 导入连接 mysql数据库  返回的变量 - 操作数据库
const promisePool = require('../../config/db.config');
const { getUserId } = require('../users');
// 临时使用 -需要优化改进
function children_List(data, children) {
    // pagepermisson ：1 有权限显示 
    data = data.filter((item) => item.pagepermisson && item.pagepermisson === 1);
    // 循环过滤   children重新赋值
    data.forEach((item) => {
        // 修改 对象 属性名 UI 组件显示用 label
        item.label = item.title;
        item.children = [];
        // item.id == childrenItem.rightid  childrenItem的父节点 为 item
        children.forEach((childrenItem) => (item.id == childrenItem.rightid && childrenItem.pagepermisson === 1) && (item.children.push(childrenItem), childrenItem.label = childrenItem.title))
        // children数组为空 没有遍历到子节点 删除 children字段
        item.children.length <= 0 && delete (item.children)
    });
    // data.forEach(item=>{
    //     item.children=[];
    //     // 修改 对象 属性名 UI 组件显示用 label
    //     item.label = item.title;
    //     // delete(item.title)
    //     children.forEach((childrenItem,index)=>{
    //         if(item.id == childrenItem.rightid ){
    //             childrenItem.label = childrenItem.title;
    //             // delete(childrenItem.title)
    //             item.children.push(childrenItem);
    //             // console.log(item)
    //         }
    //     })
    //     item.children.length<=0 && delete(item.children)
    // })
    return data
}
function rightsFilter(data, list,roleid) {
    //roleid 权限不等于1 超级管理员 - 过滤权限列表 返回当前id的具备的个人权限，超级管理员返回所有的菜单栏 - 未勾选的说明没有权限，可自行勾选 增加权限及 pagepermisson 设置为null控制其左侧菜单栏无权限显示
    // 过滤权限
    let dataFilter =  roleid!=1? data.filter(item => list.includes(item.key)): data.map(item => !list.includes(item.key)?{...item,pagepermisson:null}:item );
    // 子
    dataFilter.forEach(item => (item.children ) && (item.children = rightsFilter(item.children, list,roleid),item.children.length <= 0 &&  (item.children='') ))
    return dataFilter;
}
const rights = {
    // C 层 调用 M层操作数据库 - 获取权限表
    rights: async (id) => {
        // 不知道怎么查询 生成 JSON 树类型的数据 - 优化前的笨方法 - 需优化 
        // 查询 权限主表 - 菜单栏
        // let rights = await promisePool.query (`select * from rights;`)
        // 查询 关联权限的子表 - 菜单栏 子
        // let rights_children = await promisePool.query (`select * from rights_children;`)
        // 将两个表数据处理成树状图格式
        // let data = children_List(rights[0],rights_children[0]);
        // const data1 = await promisePool.query(` SELECT * FROM rights_children AS children;`)
        // const data1 = await promisePool.query(` select s.id, s.title , s.key , s.pagepermisson , s.grade  ,c.id cid, c.title ctitle, c.key ckey, c.pagepermisson cp, c.grade cg  from rights s left join rights_children c on s.id = c.rightId ;`).then(res=>{
        // console.log(data)
        // }) ;

        // 尝试优化的 测试代码
        // let data1 = await promisePool.query (`select e.id,e.title, GROUP_CONCAT(CONCAT_WS(':',ea.title,ea.grade)  ) as children from rights e  LEFT JOIN rights_children ea ON ea.rightid = e.id GROUP BY e.id`)
        // e.* 表示需要 别名为 rights 的表 内所有字段 输出 JSON_OBJECT 生成json 
        // let data2 = await promisePool.query(`select  e.* , JSON_OBJECT('title',ea.title,'rightid',ea.rightid ) as children from rights e  LEFT JOIN rights_children ea ON ea.rightid = e.id 
        // ;
        // `)

        // 查询 生成 JSON 树类型的数据 - 优化后
        /*
         mysql 
            p.* * 表示需要 别名 p 为 rights 的表 内所有字段， p.title as label 增加一个 前端需要的 label字段返回 

            IF(COUNT(pt.id) = 0, JSON_ARRAY(), 解释说明 ： 不会计算空值，
            如果值不存在 为null childre 为空数组（JSON_ARRAY()函数为返回一个数组 当前你也可以使用空字符串 ，如 IF(COUNT(pt.id) = 0, '' ,  ）

        高级函数
              JSON_ARRAYAGG​ ​聚合函数返回指定列中值的JSON格式数组。注意，JSON 数组中元素的顺序是随机的。

            JSON_OBJECT 构造 JSON 对象 生成json  语法为 ：json_object('key',value)

            GROUP BY p.id 代表 GROUP BY 列名 表示 代表根据 此列（pid 列） 进行分组
        */
        // let data = await promisePool.query(`SELECT p.*,p.title as label, IF(COUNT(pt.id) = 0, JSON_ARRAY(),
        // json_arrayagg(
        //     json_object(
        //    'id', pt.id,
        //    'title', pt.title,
        //    'label', pt.title,
        //    'key', pt.key,
        //    'rightid', pt.rightid, // 对应父级的 id
        //    'grade', pt.grade, // grade 层级 1级为1 ， 2级为2
        //    'pagepermisson', pt.pagepermisson  )
        //     )
        //     ) as children
        // FROM rights p LEFT JOIN rights_children pt
        // ON p.id = pt.rightid
        // GROUP BY p.id;`)

        /*
            扩展优化 json_arrayagg 无法排序 - 上面的查询 ，
            rights_children 内的 查询结果使用 JSON_OBJECT生成 object 并且根据id 进行排序 ORDER BY  ea.id （从小到大）
    
            IF( COUNT(ea.id) = 0,JSON_ARRAY()解释说明 ： ea.id没有返回条件的ea.rightid children给一个 JSON_ARRAY() （数组-未赋值的空数组 ）
    
            concat函数的用法（连接字符串）此处是 连接字符串数组  CONCAT('[',内容,']')
    
            GROUP_CONCAT  group_concat( 要连接的字段 [ORDER BY ASC/DESC 排序字段] [Separator '分隔符' 逗号分隔(默认)]) 配合 group by id 使用
    
            group by id 以id分组 把 children 字段的值打印在一行
            注意：children 字段里面 数据为 JSON字符串
    
            通过 CAST( value as 类型) 函数 转换 类型， CAST( 内容 as JSON) 将字符串 转为 JSON 类型
        */
        // 个人信息+权限
        let userinfo = await getUserId(id);
       
        //    权限列表 
        let rights = await promisePool.query(`select e.*,e.title AS label, IF( COUNT(ea.id) = 0,JSON_ARRAY(), CAST( CONCAT('[',
                    GROUP_CONCAT( JSON_OBJECT('id', ea.id,
                        'label', ea.title,
                        'title', ea.title,
                        'key', ea.key,
                        'rightid', ea.rightid,
                        'grade', ea.grade,
                        'pagepermisson', ea.pagepermisson ) ORDER BY  ea.id) ,']'
                                    ) as JSON) )  as children from rights e  LEFT JOIN rights_children ea ON ea.rightid = e.id   GROUP BY e.id;
                ;`)
        // 获取个人信息中的 权限 - 字符串转数组 去除空格  filter 过滤 数组内的空字符串 /\S/
        let list = (userinfo[0].roles.rights.replace(/\r\n|\n/g, "").split(',')).filter((ktem) => /\S/.test(ktem));
        console.log('权限列表==>',rights,userinfo[0])
        let { roleid} = userinfo[0]
        console.log(typeof roleid)
        //过滤权限列表 返回当前id的具备的个人权限
        let data = rightsFilter(rights[0], list,roleid)
        console.log(data)
        return data;
    },
    rightsTree: async (id) => {
        // 个人信息+权限
        let userinfo = await getUserId(id);
        //    权限列表 
        let rights = await promisePool.query(`select e.*,e.title AS label, IF( COUNT(ea.id) = 0,JSON_ARRAY(), CAST( CONCAT('[',
                    GROUP_CONCAT( JSON_OBJECT('id', ea.id,
                        'label', ea.title,
                        'title', ea.title,
                        'key', ea.key,
                        'rightid', ea.rightid,
                        'grade', ea.grade,
                        'pagepermisson', ea.pagepermisson ) ORDER BY  ea.id) ,']'
                                    ) as JSON) )  as children from rights e  LEFT JOIN rights_children ea ON ea.rightid = e.id   GROUP BY e.id;
                ;`)
        // 获取个人信息中的 权限 - 字符串转数组 去除空格  filter 过滤 数组内的空字符串 /\S/
        let list = (userinfo[0].roles.rights.replace(/\r\n|\n/g, "").split(',')).filter((ktem) => /\S/.test(ktem));
        console.log('权限列表==>', userinfo[0].roleid,rights)
       
        //roleid 权限不等于1 超级管理员 - 过滤权限列表 返回当前id的具备的个人权限，超级管理员返回所有的菜单栏 - 未勾选的说明没有权限，可自行勾选 增加权限及其左侧菜单栏回显
        let data = userinfo[0].roleid!=1? rightsFilter(rights[0], list):rights[0];
        console.log(data)
        return data;
    },
    /*
    SELECT p.*,json_object(
       
      'children', IF(COUNT(pt.id) = 0, JSON_ARRAY(),
                 json_arrayagg(json_object(
                    'petId', pt.id,
                    'petName', pt.title
    
                    )
                ))
      ) as children
    FROM rights p LEFT JOIN rights_children pt
    ON p.id = pt.rightid
    GROUP BY p.id;
    */

    // C 层 调用 M层操作数据库 - 假删除  修改权限表
    rightsDelete: async ({ grade, id }) => {
        let data = null;
        //  grade 表所在的 层级 1级为1 ， 2级为2 一级 pagepermisson 字段 1 说明 有权限展示 0 无权限 null 说明不是页面
        if (grade === '1') {
            data = await promisePool.query(`update rights set pagepermisson=0 where id=${id};`)
            console.log(data)
        } else if (grade === '2') {
            data = await promisePool.query(`update rights_children set pagepermisson=0 where id=${id};`)
            console.log(data)
        }
        return data;
    },

    // C 层 调用 M层操作数据库 - 修改权限表
    rightsUpdate: async ({ grade, id, pagepermisson }) => {
        let data = null;
        // 一级 主表
        if (grade === '1') {
            data = await promisePool.query(`update rights set pagepermisson=${pagepermisson} where id=${id};`)
            console.log(data)
        } else if (grade === '2') {// 子级
            data = await promisePool.query(`update rights_children set pagepermisson=${pagepermisson} where id=${id};`)
            console.log(data)
        }
        return data;
    }
}
module.exports = rights;


// select e.*,e.title AS label, IF( COUNT(ea.id) = 0,JSON_ARRAY(), CONCAT('[',
//       GROUP_CONCAT( JSON_OBJECT('id', ea.id,
//            'label', ea.title,
//            'key', ea.`key`,
// 					 'rightid', ea.rightid,
//            'grade', ea.grade,
//            'pagepermisson', ea.pagepermisson ) ORDER BY  ea.id) ,']'
// 					 ) )  as children from rights e  LEFT JOIN rights_children ea ON ea.rightid = e.id   GROUP BY e.id;
// ;



