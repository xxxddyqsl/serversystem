//对于 roles 表 内字段的解释说明
// {
//     id,
//     roleName, 表示角色 名
//     roleType,  表示角色 等级 1 为超级管理员
//     rights, 表示 该角色 拥有的  权限- 字符串形式
//     disable, 表示 权限 是否删除 （假删除）  1 (为真) 可用 0 (为假) 不可用
//     backups ,表示 只是备份 rights 初始的默认权限，后续操作 角色的权限 都是操作 rights字段
//     rightsdele ,表示 被删除的权限 - 字符串形式
// }

// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const roles = {
    roles: async (ctx, next) => {
        // console.log('获取请求参数get=>',ctx.query,ctx.querystring)
        // M层 model 操作数据库 并且返回数据
        const data = await apiModel.roles();
        // console.log(data)
        ctx.body = {Code: 0,Data:data};
    },
    rolesDelete: async (ctx, next) => {
        // console.log( ctx.query,)
        const {id}=ctx.query;
        const data = await apiModel.rolesDelete({id});
        ctx.body = {Code: 0,Data:data};
    },
    rolesUpdate:async(ctx, next) => {
        let {id,set}=ctx.request.body;
        // console.log( id,  set ,ctx.request.body)
        const data = await apiModel.rolesUpdate({id,set});
        ctx.body = {Code: 0,Data:data};
    },
}

module.exports = roles;