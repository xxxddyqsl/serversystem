// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const uploads={
    // 上传用户头像
    useInfo: async (ctx, next) => {
        console.log(ctx.request.body,ctx.file)
        // 注意 multer({dest:'public/uploads/avatars/'}).single 在 上传文件 为单个文件上传 ， 获取单个文件信息， ctx.file
        // 注意 multer({dest:'public/uploads/avatars/'}).array 在 上传文件  为多个文件上传 ,  获取多个文件消息 ctx.files
         //   获取头像单个文件信息， ctx.file 为 multer 存入前端传入的文件 在 ctx 中增加的属性 , 字符串 过滤路径中的 静态资源路径中间件 public
         let avatar = ctx.file?`${ctx.file.destination.replace('public','')}${ctx.file.filename} `:null;//未上传头像 存入默认的头像地址
         let {id}=ctx.request.body;
         let set = ctx.request.body;
         if(avatar) set.avatar = avatar;
         delete set.id;
        console.log(id,set)
         const data =   await apiModel.usersSetData(id,set);
         ctx.body = {Code: 0,Data:data};
        // ctx.body=avatar
    },
      // 上传 新闻 图片
      uploadNewsImage: async (ctx, next) => {
        console.log('uploadNewsImage==>')
        console.log(ctx.request.body,ctx.file)
        let img = ctx.file?`${ctx.file.destination.replace('public','')}${ctx.file.filename} `:null;//  存入默认的img地址
        console.log(img)
        // 单个上传
        // const data = await apiModel.NewsImage(publishState,);
        // console.log(data)
        // ctx.body = {Code: 0,Data:data[0]};
        ctx.body = {Code: 0,Data:img};
    },
}

module.exports = uploads