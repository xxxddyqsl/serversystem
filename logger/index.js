// 日志管理
const log4js = require('log4js');

/*
log4js日志等级 日志等级从低到高分为6个等级：
    trace - 最低等级
    debug
    info
    warn
    error
    fatal - 最高等级
*/
// file（以文件大小划分日志文件）
const FileSizeLogs = {
    type: 'file',
    filename: 'logs/all.log', // 文件位置
    maxLogSize: 10485760, // 10mb,日志文件大小,超过该size则自动创建新的日志文件
    backups: 7, // 仅保留最新的7个日志文件
    compress: true, //  超过maxLogSize,压缩代码

}
// dateFile（以日期划分日志文件）
const FileDateLogs = {
    type: 'dateFile',
    filename: 'logs/',// 文件位置
    backups: 7,  // 仅保留最新的7个日志文件
    pattern: ".yyyy-MM-dd", // 用于确定何时滚动日志的模式
    alwaysIncludePattern: true,

    maxLogSize: 10485760, // 10mb,日志文件大小,超过该size则自动创建新的日志文件
    compress: true, //  超过maxLogSize,压缩代码

}
// 配置
log4js.configure({
    appenders: { //输出源
        //设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
        out: { type: 'console' },

        // file（以文件大小划分日志文件）
        infoLogs: FileSizeLogs,
        //http请求日志  http请求日志需要app.use引用一下， 这样才会自动记录每次的请求信息
        httpLog: { ...FileDateLogs, type: "dateFile", filename: "logs/httpAccess.log", pattern: ".yyyy-MM-dd", keepFileExt: true },
        //错误日志 type:过滤类型logLevelFilter,将过滤error日志写进指定文件
        errorLog: { type: 'file', filename: 'logs/error.log' },
        error: { type: "logLevelFilter", level: "error", appender: 'errorLog' }
    },
    categories: {//类别
        default: { appenders: ['infoLogs'], level: 'info' },
        httpLog: { appenders: ['httpLog'], level: 'info' },
        errorLog: { appenders: ['errorLog'], level: 'info' },
        error: { appenders: ['error'], level: 'info' },
    },
})
// const logger = log4js.getLogger("liveMeeting");

// const httpLog = log4js.getLogger('http');

// const httpLogger = log4js.connectLogger(httpLog, { level: 'WARN' }); 
// 导出
module.exports = log4js;