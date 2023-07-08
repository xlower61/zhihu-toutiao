import { zhihu } from '@/request/index'
//当日新闻列表
export const getLastestNews = () => {
  return zhihu.get('/news/latest')
}
//以往新闻列表
export const getBeforeNews = (date) => {
  return zhihu.get(`/news/before/${date}`)
}
//指定新闻的评论和点赞数
export const getNewsItemInfo = (id) => {
  return zhihu.get(`/story-extra/${id}`)
}

//指定新闻详细内容
export const getNewsDetail = (id) => {
  return zhihu.get(`/news/${id}`)
}
