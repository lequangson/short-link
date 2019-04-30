import { observable, action } from 'mobx';
import agent from '../agent';

class UserStore {

  @observable currentUser;
  @observable loadingUser;
  @observable updatingUser;
  @observable updatingUserErrors;

  @action pullUser = () => {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(action(({ success }) => { this.currentUser = success; }))
      .finally(action(() => { this.loadingUser = false; }))
  }

  @action updateUser(newUser) {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(action(({ success }) => { this.currentUser = success; }))
      .finally(action(() => { this.updatingUser = false; }))
  }

  @action forgetUser() {
    this.currentUser = undefined;
  }

}

export default new UserStore();
