//  文件上传 - 路径处理
// 引入 @koa/multer 因为@koa/multer 依赖于multer 处理前端传入文件时 数据的编码格式："multipart/form-data"
const multer = require('@koa/multer');
const fs = require('fs')
const path = require('path')
// 设置 文件上传 配置 如
// const uploadAvatars  = multer({
//     // 设置文件存储位置
//     destination:function(req,file,cb){
//         // 将每天上传的文件 分开管理 - 如每天上传的文件单独存储在一个文件夹中 该文件夹 以每天的日期命名
//         // 获取日期 年月日
//         let date = new Date();
//         let year = date.getFullYear(),month=date.getMonth()+1,day=date.getDay();
//         // 创建 一个路径
//         let dir = 'public/uploads/'+year+month+day;
//         // 判断 目录是否存在 
//         if(!fs.existsSync(dir)){
//             // 目录不存在 创建目录
//             fs.mkdirSync(dir,{
//                 recursive:true
//             })
//         }
//         // 将文件 上传到这个目录
//         cb(null,dir)
//     },
//     // 设置文件存储名称 -
//     filename:function(req,file,cb){

//     }
// }); 
// 优化 上传文件 文件夹创建 及其 路径+文件夹名
const uploads = {
    // 头像 - dirDateName 指定的文件夹名  参数 dirName 默认值为 avatars
    uploadsPath: ({ dirDateName = null, dirName = 'avatars' }) => {
        // 未传入 指定 dirDateName 文件夹名   ，获取当前 年月日 ，为文件夹名
        if (!dirDateName) {
            // 获取日期 年月日
            let date = new Date();
            let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDay();
            dirDateName = `${year + '' + (month < 10 ? '0' + month : month) + '' + (day < 10 ? '0' + day : day)}`;
        }
        // 配置 将上传的 文件 存在 'public/uploads/avatars/ 文件夹内 如果 uploads/avatars文件夹不存在 会自动创建 uploads/avatars文件夹// 该 文件夹为专门存放  头像的文件夹
        // const uploadAvatars  = multer({dest:'public/uploads/avatars/'});
        // 配置 将上传的 文件 存在 'public/uploads/avatars/ 文件夹内 如果 uploads/avatars文件夹不存在 会自动创建 uploads/avatars文件夹
        const uploadAvatars = multer({ dest: `public/uploads/${dirName}/${dirDateName}/`,filename:(req,file,cb)=>{
            // 设置文件名称 - 文件原名 + 时间戳 + 后缀名 
        let fileName = file.filename + '-'+ Date().now() + path.extname(file.originalname);
        // 返回 设置的文件名
        cb(null,fileName)
    }});
        // 返回 uploadAvatars 对象
        return uploadAvatars
    }
}
module.exports = uploads