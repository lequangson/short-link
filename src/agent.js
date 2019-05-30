import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'
import commonStore from './stores/commonStore'
import authStore from './stores/authStore'
import { ROOT_URL } from './constant'

const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = `${ROOT_URL}api`
const API_FACEBOOK = `https://graph.facebook.com`

const encode = encodeURIComponent

const handleErrors = err => {
  const status = err && err.response && err.response.status
  const error = err && err.response && err.response
  if (status === 401) {
    authStore.logout()
  }
  if (status === 500) {
    alert('somthing went wrong! please refesh before try again')
  }
  return error
}

const responseBody = res => res.body

const tokenPlugin = req => {
  if (commonStore.token) {
    req.set('authorization', `Bearer ${commonStore.token}`)
    req.set('accept', 'application/json')
    req.set('X-Requested-With', XMLHttpRequest)
  }
}

// const tokenPlugin = req => {
//   if (commonStore.token) {
//     req.set('authorization', `Token ${commonStore.token}`)
//   }
// }

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
}

const requestsFacebook = {
  del: url =>
    superagent
      .del(`${API_FACEBOOK}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_FACEBOOK}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_FACEBOOK}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_FACEBOOK}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
}

const Auth = {
  current: () => requests.post('/details'),
  login: (email, password) => requests.post('/login', { email, password }),
  register: (username, email, password) =>
    requests.post('/register', {
      name: username,
      email,
      password,
      c_password: password,
    }),
  save: user => requests.put('/user', { user }),
}

const ShortLink = {
  handleShortLink: data => requests.post('/short-link', data),
}

const Facebook = {
  getFacebook: url => requestsFacebook.get(url),
  postFacebook: (url, data) => requestsFacebook.post(url, data),
}

const Edit = {
  editLink: data => requests.post('/edit-link', data),
  editLinks: data => requests.post('/edit-links', data),
}

const DeleteLinks = {
  deleteLinks: data => requests.post('/delete-links', data),
}

const GetAllLinks = {
  getAllLinks: () => requests.get('/v1/get-all-links'),
}

const Tags = {
  getAll: () => requests.get('/tags'),
}

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`
const omitSlug = article => Object.assign({}, article, { slug: undefined })

const Articles = {
  all: (page, lim = 10) => requests.get(`/articles?${limit(lim, page)}`),
  byAuthor: (author, page, query) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page, lim = 10) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(lim, page)}`),
  del: slug => requests.del(`/articles/${slug}`),
  favorite: slug => requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () => requests.get('/articles/feed?limit=10&offset=0'),
  get: slug => requests.get(`/articles/${slug}`),
  unfavorite: slug => requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article => requests.post('/articles', { article }),
}

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug => requests.get(`/articles/${slug}/comments`),
}

const Profile = {
  follow: username => requests.post(`/profiles/${username}/follow`),
  get: username => requests.get(`/profiles/${username}`),
  unfollow: username => requests.del(`/profiles/${username}/follow`),
}

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  ShortLink,
  Edit,
  DeleteLinks,
  GetAllLinks,
  Tags,
  Facebook,
}
