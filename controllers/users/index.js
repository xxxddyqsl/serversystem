//对于 users 表 内字段的解释说明
// {
//     id,
//     username,
//     password,
//     rolestate, 表示用户状态 是否打开 开关 1 (为真) 打开 0 (为假)关闭
//     default, 表示 用户 默认 1表示默认不可删除 0 可删除
//     region, 表示 用户 负责的区域 ， 为空字符串时 是全球
//     roleid,表示 超级管理员 区域管理员   区域编辑的 id 对应 rols表中的 roleType 字段
// }

// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const users = {
    users: async (ctx, next) => {
        const data = await apiModel.users();
        console.log(data)
        ctx.body = {Code: 0,Data:data};
    },
    usersAdd: async (ctx, next) => {
        // console.log(ctx.query,ctx.params)
        console.log('post请求参数==>',ctx.request.body)
        const data = await apiModel.usersAdd(ctx.request.body);
        ctx.body = {Code: 0,Data:data};
    },
    usersDelete: async (ctx, next) => {
        // console.log(ctx.query,ctx.params)
        // console.log('post请求参数==>',ctx.request.body)
        let {id}=ctx.request.body;
        const data =  await apiModel.usersDelete(id);
        ctx.body = {Code: 0,Data:data};
    },
    usersSetData: async (ctx, next) => {
        // console.log(ctx.query,ctx.params)
        // console.log('post请求参数==>',ctx.request.body)
        let {id,set}=ctx.request.body;
        const data =   await apiModel.usersSetData(id,set);
        ctx.body = {Code: 0,Data:data};
    },
}
module.exports = users