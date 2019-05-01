import { observable, action } from 'mobx';
import { ROOT_URL } from '../constant'
import agent from '../agent';
// window.location.origin
class ShortLinks {

  @observable mainUrl;
  @observable subUrl;
  @observable listShort;
  @observable allLinks;
  @observable loading = false;

  @action setMain = (mainUrl) => {
    this.mainUrl = mainUrl;
  }

  @action setUrl = (subUrl) => {
    this.subUrl = subUrl;
  }

  @action getAllLinks = () => {
    this.loading = true;
    return agent.GetAllLinks.getAllLinks()
      .then(action(({ data }) => { this.allLinks = data }))
      .finally(action(() => { this.loading = false; }))
  }

  @action shortLink = () => {
    this.loading = true;
    const listForSent = this.subUrl.reduce((listFinal, item) => {
      listFinal.push({main_url: this.mainUrl, sub_url: item})
      return listFinal
    }, [])
    return agent.ShortLink.handleShortLink({ links: listForSent })
      .then(action(({ data }) => { this.listShort = data.map(item => `${ROOT_URL}${data.item}`) }))
      .then(() => this.getAllLinks())
      .finally(action(() => { this.loading = false; }))
  }


  @action deleteLinks = (data) => () => {
    this.loading = true;
    return agent.DeleteLinks.deleteLinks({codes: data})
      .then(() => this.getAllLinks())
      .finally(action(() => { this.loading = false; }))
  }

}

export default new ShortLinks();
