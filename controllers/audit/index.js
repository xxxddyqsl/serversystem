


// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const audit = {
      // 审核列表 -  查询 出来 所有 审核 - 通过 、未通过 、 和审核中的 数据，已发布的不审核列表中显示
     auditList: async (ctx, next) => {
        // 如 http://localhost:3000/api/api/news/15
        let {authorId,auditState,publishState}= ctx.query ;
        // console.log('获取url 后面的参数', ctx.query)
        const data = await apiModel.auditList({authorId,auditState,publishState});
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
    // 审核新闻  -  查询 出来 所有 auditState 审核状态等于1审核中的数据 并且  返回 小于等于当前roleid权限的用户数据, 并且 roleid=1 查询所有区域的用户 否则返回 同级及以下的同区域的用户
    auditNews: async (ctx, next) => {
        // 如 http://localhost:3000/api/api/news/15
        let {auditState,roleid,region}= ctx.query ;
        // console.log('获取url 后面的参数', ctx.query)
        const data = await apiModel.auditNews({auditState,roleid,region});
        // console.log(data)
        ctx.body = {Code: 0,Data:data[0]};
    },
}
module.exports = audit