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
const news = {
    // 获取指定id的新闻
    newsId: async (id) => {
        //  join 联接 多表查询 roles表 categories表
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

            where  (n.id=${id}) and (newsDele != 1 )   GROUP BY n.id; `);
        return data[0];
    },
    // 获取 所有发布的 新闻 desc 从大到小 降序 返回
    newsDesc: async (publishState,LIMIT,sortkey) => {
        // sortkey 中目前 包含了  star 或 view 按哪个进行排序 不传 默认按view排序
       
          //  join 联接 多表查询 roles表 categories表
          const data = await promisePool.query(`select n.*, 
          IF( COUNT(c.id) = 0,JSON_ARRAY(), CAST(
          GROUP_CONCAT( JSON_OBJECT('id', c.id,
          'title', c.title,
          'value', c.value ) ORDER BY  c.id)  as JSON) )  as category

          from news as n
          left JOIN categories c on c.id=n.categoryId


          where  (n.publishState=${publishState}) and (newsDele != 1 )  GROUP BY n.id ORDER BY ${sortkey?sortkey:'view'} desc LIMIT ${LIMIT?LIMIT:10}; `);
        //ORDER BY view desc 按浏览量降序   LIMIT   要多少条 数据 不传 默认10条
      return data;
    },
    // 获取新闻类别
    categories: async () => {
        const data = await promisePool.query(`SELECT  * FROM categories where(dele != 1)  ;`)
        return data[0];
    },
    // 更新修改 新闻类别
    categoriesSetData: async ({ id, set }) => {
        // 获取修改字段的key
        let nameArr = Object.keys(set);
        // 第一种是正则表达式来判断，判断输入的字符中是否包含中文。
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", 'g');
        // 拼接 字段 +修改的value 返回数组 join 转字符串,分割 字段包含中文 添加引号 如字符串 为空 赋值 空的""
        let msg = nameArr.map((item) => `${item}=${(typeof set[item] == 'string' || reg.test(set[item]) ? `"${set[item]}"` : set[item] == null ? 'null' : set[item])}`);
        // console.log(msg)
        //   修改字段状态
        let data = await promisePool.query(`update categories set ${msg} where id=${id};`)
        return data[0];
        // return '';
    },
    // 添加 新闻类别
    categoriesAdd: async (params) => {
        // 获取修改字段的key
        let nameArr = Object.keys(params);
        // 第一种是正则表达式来判断，判断输入的字符中是否包含中文。
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", 'g');
        // 拼接  修改的value 返回数组 join 转字符串,分割 字段包含中文 添加引号 如字符串 为空 赋值 空的""
        let content = Object.keys(params).map(item => typeof params[item] == 'string' || reg.test(params[item]) ? `"${params[item]}"` : params[item] == null ? 'null' : params[item]);
        //    关键字 view 替换为 `view`
        let key = nameArr.join().replace(/view/, '`view`')
        let value = content.join();
        // 创建数据 存入数据库
        await promisePool.query(`insert  into categories(${key}) values (${value}); `);
        // 添加 成功 获取新闻 新闻类别 返回
        const data = await news.categories()
        return data[0];

    },
    // auditState 0 保存草稿 || auditState 1 提交审核
    saveDraft: async (params) => {
        // console.log(params)
        // 获取修改字段的key
        let nameArr = Object.keys(params);
        // 第一种是正则表达式来判断，判断输入的字符中是否包含中文。
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", 'g');
        // 拼接  修改的value 返回数组 join 转字符串,分割 字段包含中文 添加引号 如字符串 为空 赋值 空的""
        let content = Object.keys(params).map(item => typeof params[item] == 'string' || reg.test(params[item]) ? `"${params[item]}"` : params[item] == null ? 'null' : params[item]);
        //    关键字 view 替换为 `view`
        let key = nameArr.join().replace(/view/, '`view`')
        let value = content.join();
        // 创建数据 存入数据库
        const data = await promisePool.query(`insert  into news(${key}) values (${value}); `);

        // console.log(data)

        return data[0];
    },
    // 获取 草稿 列表 auditState= 0 为草稿 newsDele 0 未删除 1 已删除
    drafts: async (id) => {
        // let params = ctx.request.body;
        const data = await promisePool.query(`select n.*, IF( COUNT(c.id) = 0,JSON_ARRAY(), CAST(
        GROUP_CONCAT( JSON_OBJECT('id', c.id,
        'title', c.title,
        'value', c.value ) ORDER BY  c.id)  as JSON) )  as category
        from news as n left JOIN categories c on c.id=n.categoryId where (auditState = 0) and (authorId=${id}) and (newsDele != 1 )   GROUP BY n.id; `);
        return data[0];
    },
    // 新闻删除
    newsDele: async (id) => {
        const data = await promisePool.query(`update news set newsDele=1 where (news.id=${id});`)
        return data[0];
    },
     // 新闻修改 更新
    newsSetData: async ({ id, set }) => {
        // 获取修改字段的key
        let nameArr = Object.keys(set);
        // 第一种是正则表达式来判断，判断输入的字符中是否包含中文。
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", 'g');
        // 拼接 字段 +修改的value 返回数组 join 转字符串,分割 字段包含中文 添加引号 如字符串 为空 赋值 空的""
        let msg = nameArr.map((item) => `${item}=${(typeof set[item] == 'string' || reg.test(set[item]) ? `"${set[item]}"` : set[item] == null ? 'null' : set[item])}`);
        // console.log(msg)
        //   修改字段状态
        let data = await promisePool.query(`update news set ${msg} where id=${id};`)
        return data[0];
        // return '';
    },
// 统计出 每个新闻类型 已发布的 数量 
    newsCount:async (set)=>{
         // 获取修改字段的key
         let nameArr = Object.keys(set);
         // 第一种是正则表达式来判断，判断输入的字符中是否包含中文。
         let reg = new RegExp("[\\u4E00-\\u9FFF]+", 'g');
         // 拼接 字段 +修改的value 返回数组 join 转字符串,分割 字段包含中文 添加引号 如字符串 为空 赋值 空的""
         let msg = nameArr.map((item) => `${item}=${(typeof set[item] == 'string' || reg.test(set[item]) ? `"${set[item]}"` : set[item] == null ? 'null' : set[item])}`).join('');
        //  console.log(msg) 如publishState=2
        // 统计出 每个新闻类型 已发布的 数量 COUNT 聚合函数 是用来统计表中记录的一个函数，返回匹配条件的行数
        // 如下sql 语句解释说明 COUNT(IF(条件, true=执行1 , false 执行2 ) 类似  三目运算 ) 满足if条件 返回 news.id COUNT函数 统计 有多少个 满足if条件 返回 的news.id，
        // 不满足if条件的返回 null, COUNT 函数返回0 ， 注意需要配合 GROUP BY   使用
        const data = await promisePool.query(`
        select c.*, COUNT( IF(n.${msg}, n.id , NULL )  )   as 'news_count'

          from categories  as c

          left JOIN news n on c.id = n.categoryId

          GROUP BY   c.id ;
        `)
        // const data = await promisePool.query(`select c.*, COUNT(IF(n.publishState = 2, n.id , NULL )  )   as 'news_count'

        // from categories  as c 
        // left JOIN news n on c.id = n.categoryId    GROUP BY   c.id ;`)
        return data;
    }

}
module.exports = news