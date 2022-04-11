import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'https://express-oi2w-1735251-1309420024.ap-shanghai.run.tcloudbase.com/api/inspection_page',
    method: 'post',
    headers: { authorization: sessionStorage.getItem('token') },
    params
  })
}
