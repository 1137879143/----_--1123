import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/inspection_page',
    method: 'post',
    headers: { authorization: sessionStorage.getItem('token') },
    params
  })
}
