// import request from '@/utils/request'
import request from '@/utils/request'

// 新增记录
export function registration(data) {
  return request({
    url: '/api/new_record',
    method: 'post',
    data
  })
}

// 根据零件4位数查找倒序查找零件信息
export function read_prtnum(data) {
  return request({
    url: '/api/read_prtnum',
    method: 'post',
    data
  })
}

// 根据零件4位数查找倒序查找零件信息
export function onchangepepole(data) {
  return request({
    url: '/api/onchangepepole',
    method: 'post',
    data
  })
}

// 获取今日登记消息 无参数
export function read_today() {
  return request({
    url: '/api/get_today',
    method: 'post'
  })
}

// 根据id查询工艺卡信息 参数id
export function get_InspectionId(data) {
  return request({
    url: '/api/get_InspectionId',
    method: 'post',
    data
  })
}

// 获取数据分析记录 无参数
export function get_analysis() {
  return request({
    url: '/api/get_analysis',
    method: 'post'

  })
}

// 获取人员列表 /无参数
export function getpepoleList() {
  return request({
    url: '/api/getpepoleList',
    method: 'post'

  })
}
// 创建 人员
export function add_user(data) {
  return request({
    url: '/api/add_user',
    method: 'post',
    data
  })
}
