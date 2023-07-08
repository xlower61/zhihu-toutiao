import { needCode } from '@/request/index'

// qs包用于转成序列化url
import qs from 'qs'
export const getCodeAPI = (tel) => {
  return needCode.post('/login/code', qs.stringify({ tel: tel }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const updateCodeAPI = (tel) => {
  return needCode.post('/login/updateCode', qs.stringify({ tel: tel }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const LoginAPI = (tel, code) => {
  return needCode.post('/login', { tel, code })
}
