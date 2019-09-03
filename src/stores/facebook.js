import { observable, action } from 'mobx';
import agent from '../agent';
import commonStore from './commonStore';

class FacebookStore {
  @observable inProgress = false
  @observable errors = undefined

  @action getUser(url) {
    this.inProgress = true
    this.errors = undefined
    return agent.Facebook.getFacebook(url)
      .then(data => {
        return commonStore.setToken(data.token)
      })
      .catch(
        action(err => {
          this.errors =
            err.response && err.response.body && err.response.body.errors
          throw err
        }),
      )
      .finally(
        action(() => {
          this.inProgress = false
        }),
      )
  }

  @action postArticle = (url, data) => {
    return agent.Facebook.postFacebook(url, data)
      // .then(data => {
      //   return commonStore.setToken(data.token)
      // })
      // .catch(
      //   action(err => {
      //     this.errors =
      //       err.response && err.response.body && err.response.body.errors
      //     throw err
      //   }),
      // )
  }
}

export default new FacebookStore();
