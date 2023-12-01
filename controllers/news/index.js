
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
        // console.log('获取url 后面的参数',ctx.params ,id)

        const data = await apiModel.newsId(id);
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
    // 所有的新闻中 publishState 2已发布上线 view浏览量 从大到小 降序 返回
    newsDesc: async (ctx, next) => {
        // 如 http://localhost:3000/api/api/news/15
        let {publishState,LIMIT,sortkey}= ctx.query ;
        // console.log('获取url 后面的参数',ctx.query )

        const data = await apiModel.newsDesc(publishState,LIMIT,sortkey);
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
    // 统计出 每个新闻类型 已发布的 数量   (根据  字段 及其 字段状态 如当前 publishState:2  其他 auditState:2 也是可以 ) 的 数量
    newsCount:async (ctx, next)=>{
        let params = ctx.query
        // console.log('获取url 后面的参数==>',params,typeof params)

        const data = await apiModel.newsCount(params);
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
    // 获取新闻分类
    categories: async (ctx, next) => {
        const data = await apiModel.categories();
        // console.log(data)
        ctx.body = {Code: 0,Data:data};
    },
    // 更新修改 新闻分类
    categoriesSetData: async (ctx, next) => {
        let {id,set}  = ctx.request.body;
        const data = await apiModel.categoriesSetData({id,set});
        ctx.body = {Code: 0,Data:data};
    },
    // 添加 新闻分类
    categoriesAdd: async (ctx, next) => {
        let params = ctx.request.body;
        // console.log(params)
        const data = await apiModel.categoriesAdd(params);
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
    // 更新 新闻内容
    newsSetData: async (ctx, next) => {
        // 如 http://localhost:3000/api/api/news/15
        let {id}= ctx.params ;
        let set = ctx.request.body;
        // console.log(id,set)
        const data = await apiModel.newsSetData({id,set});
        ctx.body = {Code: 0,Data:data};
    },
    // 获取所有新闻列表  根据发布状态
    newsList: async (ctx, next) => {
        // 如 http://localhost:3000/api/api/news/15
        let {publishState,}= ctx.query ;
        // console.log('获取url 后面的参数',ctx.query )

        const data = await apiModel.newsList(publishState,);
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
}
module.exports = news