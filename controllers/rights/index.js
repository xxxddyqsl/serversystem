//对于 rights 表 内字段的解释说明
// {
//     id,
//     title, 表示权限名
//     key, 表示权限 路径
//     pagepermisson,  表示 是否是页面 并且是否有权限显示 该页面 （ 1 表示有权限该路径 展示页面 ，0表示没有权限， null 表示不是页面 ）
//     grade, 表示 该等级权限的层级 （1 表示为顶层 2 表示为第二层说明有父层 ）
// }

//对于 rights_children 表 内字段的解释说明 - 为 rights 表 的子表
// {
//     id,
//     rightid, 表示 该权限的 父级 id （对应 rights 表中的 id）
//     title, 表示权限名
//     key, 表示权限 路径
//     pagepermisson,  表示 是否是页面 并且是否有权限显示 该页面 （ 1 表示有权限该路径 展示页面 ，0表示没有权限， null 表示不是页面 ）
//     grade, 表示 该等级权限的层级 （1 表示为顶层 2 表示为第二层说明有父层 ）
// }


// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const rights = {
    rights: async (ctx, next) => {
        console.log('获取请求参数get=>',ctx.query,ctx.querystring)
        let {id}=ctx.query; 
        // M层 model 操作数据库 并且返回数据
        const data = await apiModel.rights(id);
        // console.log(data)
        ctx.body = {Code: 0,Data:data};
    },
    rightsTree: async (ctx, next) => {
        console.log('获取请求参数get=>',ctx.query,ctx.querystring)
        let {id}=ctx.query; 
        // M层 model 操作数据库 并且返回数据
        const data = await apiModel.rightsTree(id);
        // console.log(data)
        ctx.body = {Code: 0,Data:data};
    },
    rightsDelete:async(ctx, next) => {
        console.log('获取url中的请求参数 delete=>',ctx.params);
        // grade 权限层级 
        const {grade,id} = ctx.params;
        
         // M层 model 操作数据库 并且返回数据
         const data = await apiModel.rightsDelete({grade,id});
        ctx.body = {Code: 0,Data:data[0]&&'ok'};
    },
    rightsUpdate:async(ctx, next) => {
        console.log('获取url中的请求参数 update=>',ctx.params);
        // grade 权限层级 
        const {grade,id} = ctx.params;
        
        const { pagepermisson } = ctx.query;
        // M层 model 操作数据库 并且返回数据
        const data = await apiModel.rightsUpdate({grade,id,pagepermisson});
        console.log(grade,id, pagepermisson );
        ctx.body = {Code: 0,Data:data[0]&&'ok'};
    }
}
module.exports = rights ;