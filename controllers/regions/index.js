//对于 regions 表 内字段的解释说明
// {
//     id,
//     title,
//     value,
// }


// 导入- 封装的M层 model 操作数据库 ，并且给C 层 返回数据
const apiModel = require('../../model/apiModel');
const regions = {
    regions: async (ctx, next) => {
        const data = await apiModel.regions();
        // console.log(data)
        ctx.body = {Code: 0,Data:data};
    }
}
module.exports = regions