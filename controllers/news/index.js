
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
//   "roleId":1,// 新闻发布人的角色权限id 对应 roles表
//   "auditState": 2, // 审核状态 0 默认状态未审核说明是草稿 还没有审核  1 正在审核 2审核通过 3审核未通过
//   "publishState": 1,  //发布状态 0默认状态未发布 1待发布 2已上线 3已下线
//   "createTime": 1615780184222,  //新闻创建发布时间 时间戳
//   "star":0, //点赞数量
//   "view": 0, // 浏览量
//   "id":9 //
//      newsDele:0, 默认0 未被删除 1已删除
//     publishTime: 1615780184222, //发布时间
//   }


// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const news = {
     // 获取新闻
     newsId: async (ctx, next) => {
        // 如 http://localhost:3000/api/api/news/15
        let {id}= ctx.params ;
        console.log('获取url 后面的参数',ctx.params ,id)

        const data = await apiModel.newsId(id);
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
    // 获取新闻分类
    categories: async (ctx, next) => {
        const data = await apiModel.categories();
        console.log(data)
        ctx.body = {Code: 0,Data:data};
    },
    // auditState 0 保存草稿 || auditState 1 提交审核
    saveDraft: async (ctx, next) => {
        let params = ctx.request.body;
        const data = await apiModel.saveDraft(params);
        // console.log('post请求参数==>',ctx.request.body,data)
        ctx.body = {Code: 0,Data:data};
    },
    // 获取 草稿 列表
    drafts: async (ctx, next) => {
        // let params = ctx.request.body;
        // console.log('post请求参数==>',ctx.query)
        let {id}=ctx.query; 
        const data = await apiModel.drafts(id);
        ctx.body = {Code: 0,Data: data};
    },
    // 删除新闻
    newsDele: async (ctx, nex) => {
        let {id} = ctx.request.body;
        const data = await apiModel.newsDele(id);
        ctx.body = {Code: 0,Data:data};
    },
}
module.exports = news