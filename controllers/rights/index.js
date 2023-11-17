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
//     pagepermisson,  表示 是否是页面 并且是否有权限 并且在左侧菜单栏中 创建按钮 显示 该页面 （ 1 表示有权限该路径 展示页面 ，0表示没有权限， null 表示不是页面 ）
//      routepermisson 表示 是路由 但不在左侧菜单栏中创建显示 （1说明是 路由 但不在左侧菜单栏中创建按钮显示）
//     grade, 表示 该等级权限的层级 （1 表示为顶层 2 表示为第二层说明有父层 ）
// }

function rightsFilter(data, list,roleid) {
    //roleid 权限不等于1 超级管理员 - 过滤权限列表 返回当前id的具备的个人权限，超级管理员返回所有的菜单栏 - 未勾选的说明没有权限，可自行勾选 增加权限及 pagepermisson 设置为null控制其左侧菜单栏无权限显示
    // 过滤权限
    let dataFilter =  roleid!=1? data.filter(item => list.includes(item.key)): data.map(item => !list.includes(item.key)?{...item,pagepermisson:null}:item );
    // 子
    dataFilter.forEach(item => (item.children ) && (item.children = rightsFilter(item.children, list,roleid),item.children.length <= 0 &&  (item.children='') ))
    return dataFilter;
}
// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const rights = {
    rights: async (ctx, next) => {
        console.log('获取请求参数get=>',ctx.query,ctx.querystring)
        let {id}=ctx.query; 
        // M层 model 操作数据库 并且返回数据
         // 个人信息
        const userinfo = await apiModel.getUserId(id);
        let { roleid ,roles} = userinfo[0];
        //  roles 表中的 disable 字段不等于1 角色 被删除
        if(roles.disable !=1){
            ctx.status=403;
           return ctx.body = {Code:-1,Data:'',Message:'暂无该角色'};
        }
         // 权限
         const rights = await apiModel.rights(id);
        // 获取个人信息中的 权限 - 字符串转数组 去除空格  filter 过滤 数组内的空字符串 /\S/
        let list = (userinfo[0].roles.rights.replace(/\r\n|\n/g, "").split(',')).filter((ktem) => /\S/.test(ktem));
        console.log('权限列表==>',rights,userinfo[0])
        
        console.log(typeof roleid)
        //过滤权限列表 返回当前id的具备的个人权限
        const data = rightsFilter(rights, list,roleid)
        console.log(data)
       
        // console.log(data)
        ctx.body = {Code:0,Data:data};
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