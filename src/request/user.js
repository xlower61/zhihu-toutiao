import { needAuthorization } from '@/request/index'
// qs包用于转成序列化url
import qs from 'qs'

export const upLoadImgAPI = (formData) => {
  return needAuthorization.post('/user/upload', formData, {
    'Content-Type': 'application/json'
  })
}

export const updateCollectionAPI = (userId, newId, title, hint, image) => {
  return needAuthorization.post('/user/updateCollection', { userId, newId, title, hint, image })
}

//只获取收藏id，利于首页遍历
export const getAllCollectionIdAPI = (userId) => {
  return needAuthorization.post('/user/getAllCollectionId', qs.stringify({ userId }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const getAllCollectionAPI = (userId) => {
  return needAuthorization.post('/user/getAllCollection', qs.stringify({ userId }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
