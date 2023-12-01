// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');

// 引入 @koa/multer 因为@koa/multer 依赖于multer 处理前端传入文件时 数据的编码格式："multipart/form-data"
const multer = require('@koa/multer');

// 引入 koa 路由模块
const Router = require('koa-router');
const fs = require('fs')
const path = require('path')
// new 将路由模块 实例化
const router =new Router();
// 配置 将上传的 文件 存在 'public/uploads/avatars/ 文件夹内 如果 uploads/avatars文件夹不存在 会自动创建 uploads/avatars文件夹// 该 文件夹为专门存放  头像的文件夹
// const uploadAvatars  = multer({dest:'public/uploads/avatars/'});

// 方式1 uploadController.js 中 可见
//方式2 设置 文件上传 配置  案例
const uploadAvatars  = multer({
    // 设置文件存储位置
    destination:function(req,file,cb){
        // 将每天上传的文件 分开管理 - 如每天上传的文件单独存储在一个文件夹中 该文件夹 以每天的日期命名
        // 获取日期 年月日
        let date = new Date();
        let year = date.getFullYear(),month=date.getMonth()+1,day=date.getDay();
        // 创建 一个路径
        let dir = 'public/uploads/'+year+month+day;
        // 判断 目录是否存在 
        if(!fs.existsSync(dir)){
            // 目录不存在 创建目录
            fs.mkdirSync(dir,{
                recursive:true
            })
        }
        // 将文件 上传到这个目录
        cb(null,dir)
    },
    // 设置文件存储名称 -
    filename:function(req,file,cb){
            // 设置文件名称 - 文件原名 + 时间戳 + 后缀名 
        let fileName = file.filename + '-'+ Date().now() + path.extname(file.originalname);
        // 设置文件名
        cb(null,fileName)
    }
}); 


module.exports = router