
import request from '@/utils/request'

// 新增记录
export function registration(data) {
  return request({
    url: '/api/new_record',
    method: 'post',
    data
  })
}
