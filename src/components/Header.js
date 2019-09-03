import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Sign up
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <ul className="nav navbar pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        {/*<li className="nav-item">
          <Link to="/editor" className="nav-link">
            <i className="ion-compose" />&nbsp;New Post
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/settings" className="nav-link">
            <i className="ion-gear-a" />&nbsp;Settings
          </Link>
        </li>*/}

        <li className="nav-item">
          <Link
            to={`/@${props.currentUser.name}`}
            className="nav-link"
          >
            <img src={props.currentUser.image} className="user-pic" alt="" />
            {props.currentUser.name}
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/"
            className="nav-link"
            onClick={props.logout}
          >
          logout
          </Link>
        </li>

      </ul>
    );
  }

  return null;
};

@inject('userStore', 'commonStore' , 'authStore')
@observer
class Header extends React.Component {
  render() {
    const { commonStore, userStore, authStore } = this.props
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Link to="/" className="navbar-brand">
            {commonStore.appName.toLowerCase()}
          </Link>

          <LoggedOutView currentUser={userStore.currentUser} />

          <LoggedInView 
            currentUser={userStore.currentUser} 
            logout={authStore.logout} 
          />
        </div>
      </nav>
    );
  }
}

export default Header;
