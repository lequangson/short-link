import { observable, action, reaction } from 'mobx'
import agent from '../agent'

function _blankModal() {
  return {
    modalType: null,
    modalProps: {},
  }
}

function _newModal(action) {
  return {
    modalType: action.modalType,
    modalProps: action.modalProps,
  }
}

function _isPresent(current) {
  return !!current.modalType
}

function blankModal() {
  return {
    modalType: null,
    modalProps: {},
  }
}
class CommonStore {
  @observable appName = 'ShortLink'
  @observable token = window.localStorage.getItem('jwt')
  @observable appLoaded = false

  @observable tags = []
  @observable isLoadingTags = false

  @observable modalQ = []
  @observable currentModal = blankModal()

  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token)
        } else {
          window.localStorage.removeItem('jwt')
        }
      },
    )
  }

  // Append new modal to queue
  @action queueModal = data => {
    const newModal = _newModal(data)
    const newQ = this.modalQ.slice()
    newQ.push(newModal)
    const currentModal = _isPresent(this.currentModal)
      ? this.currentModal
      : newQ.shift()
    this.modalQ = newQ
    this.currentModal = currentModal
  }

  @action hideModal = () => {
    const newQ = this.modalQ.slice()
    const nextModal = newQ.shift()
    const currentModal = nextModal || _blankModal()
    this.modalQ = newQ
    this.currentModal = currentModal
  }

  @action loadTags() {
    this.isLoadingTags = true
    return agent.Tags.getAll()
      .then(
        action(({ tags }) => {
          this.tags = tags.map(t => t.toLowerCase())
        }),
      )
      .finally(
        action(() => {
          this.isLoadingTags = false
        }),
      )
  }

  @action setToken(token) {
    this.token = token
  }

  @action setAppLoaded() {
    this.appLoaded = true
  }
}

export default new CommonStore()
