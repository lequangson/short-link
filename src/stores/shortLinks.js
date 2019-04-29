import { observable, action } from 'mobx';
import agent from '../agent';

class ShortLinks {

  @observable mainUrl = 'https://codepen.io';
  @observable subUrl = '/leson92/pen/LvvOry';
  @observable loading = false;

  @action setMail(mainUrl) {
    this.mainUrl = mainUrl;
  }

  @action setUrl(subUrl) {
    this.subUrl = subUrl;
  }

  @action shortLink = () => {
    this.loading = true;
    return agent.ShortLink.handleShortLink({ main_url: this.mainUrl, sub_url: this.subUrl })
      .then(action(({ data }) => { console.log('msg', data) }))
      .finally(action(() => { this.loading = false; }))
  }

}

export default new ShortLinks();
