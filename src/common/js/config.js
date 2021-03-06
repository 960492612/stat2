// 数据对应名字
export const LegendNames = {
  readCount: "阅读量",
  thumbsCount: "点赞量",
  commontCount: "评论量",
  relayCount: "转发量",
  showCount: "收藏量"
};
export const LogisticsByOrderKey = {
  0: '订单号',
  1: '平台',
  2: '国家',
  3: '运输方式',
  4: '账号别名',
  5: '发运仓库',
  6: '订单总金额(包含客户运费)',
  7: '总数量',
  8: '第三方派送费',
  9: '头程运费成本',
  10: '派送运费',
  11: '头程关税成本',
  12: '付款时间',
  13: '发货时间',
  14: '总成本',
  15: '毛利',
  16: '毛利率',
  17: 'SKU明细',
  18: '商品总金额'
}
export const LogisticsByProductKey = {
  0: '订单号',
  1: '产品代码',
  2: '产品名称',
  3: '平均单价',
  4: '数量',
  5: '品类'
}
export const roleDefaultTickets = {
  1: [1,2,6,7,8,9,10,11,12,13,14, 16, 17],
  // 2: '推广管理员',
  3: [5,6,10],
  4: [17],
  5: [7,9,10,11,12, 15],
  6: [1,2,3,4,7,8,9,10,16],
  7: [7,9,10,11,12, 15]
}

export const roles = {
  '最高管理员':1,
  '推广管理员':2,
  '物流管理员':3,
  '财务管理员':4,
  '平台管理员':5,
  '推广员':6,
  '美工': 7
}


export const transformTypes = {
  0: '暂无转化率计算',
  1: '以订单数/访问客户数(uv)计算转化率',
  2: '以订单数/页面访问量(pv)计算转化率',
  3: '以订单数/曝光量计算转化率'
}

export const PARAMTYPES = {
  0: '公用参数',
  1: '安防摄像头',
  2: '对讲机',
  3: '灯具',
  4: '工具'
}
export const INPUTTYPES = {
  1: '文本输入',
  2: '单项选择',
  3: '多项选择',
  4: '时间选择'
}

export const UPLOADSTATUS = {
  0: "拖拽zip文件到此 <span class='el-icon-upload'></span>",
  1: "正在处理表格数据，请耐心等候 <span class='el-icon-loading'></span>",
  2: "表格已成功上传 <span class='el-icon-success'></span>",
  3: "表格上传失败，请重试，或联系管理员 <span class='el-icon-error'></span>",
  4: "数据处理完毕"
};