


// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const news = {
      //  获取 新闻待发布 列表
      publish: async (ctx, next) => {
        // 如 http://localhost:3000/api/api/news/15
        let {authorId,publishState}= ctx.query ;
        // console.log('获取url 后面的参数', ctx.query)
        const data = await apiModel.publish({authorId,publishState});
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
   
}
module.exports = news