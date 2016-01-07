import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { filter } from 'lodash';
import { login, logout } from 'redux/modules/auth';
import { makeAuthenticatedRequest } from 'redux/modules/api';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Snackbar from 'react-toolbox/lib/snackbar';
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import 'react-toolbox/lib/commons';

require('flexboxgrid/dist/flexboxgrid.css');

@connect(
  state => ({
    apiMessage: state.api.message,
    authMessage: state.auth.message,
    loggedIn: state.auth.loggedIn,
    loggingIn: state.auth.loggingIn,
    loginFailed: state.auth.loginFailed
  }),
  dispatch => bindActionCreators({login, logout, makeAuthenticatedRequest}, dispatch)
)
export default class App extends Component {

  static propTypes = {
    apiMessage: PropTypes.string,
    authMessage: PropTypes.string,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool,
    loggingIn: PropTypes.bool.isRequired,
    loginFailed: PropTypes.bool.isRequired,
    makeAuthenticatedRequest: PropTypes.func.isRequired
  };

  state = {
    email: 'dummy@user.com',
    password: 'somepassword',
    snackbarActive: false
  };

  onInputChange(name, value) {
    this.setState({...this.state, [name]: value});
  }

  onSnackbarClick() {
    this.setState({ snackbarActive: false });
  }

  onSnackbarTimeout() {
    this.setState({ snackbarActive: false });
  }

  login() {
    this.props.login(this.state.email, this.state.password).then(() => {
      this.setState({ snackbarActive: true, snackbarMessage: this.props.authMessage });
    });
  }

  logout() {
    this.props.logout().then(() => {
      this.setState({ snackbarActive: true, snackbarMessage: this.props.authMessage });
    });
  }

  makeAuthenticatedRequest() {
    this.props.makeAuthenticatedRequest().then(() => {
      this.setState({ snackbarActive: true, snackbarMessage: this.props.apiMessage });
    });
  }

  checkAuthTag() {
    // serverside render does not have access to document, only check on clientside render
    // meta node is constructed from HtmlShell.js based on response headers
    if (__CLIENT__) {
      const metaTags = document.getElementsByTagName('meta');
      const loggedInMetaNode = filter(metaTags, (metaTag) => { return metaTag.name.toLowerCase() === 'logged_in'; })[0];
      if (loggedInMetaNode) {
        return loggedInMetaNode.getAttribute('content') === 'true';
      }
    }
  }

  renderAuthState() {
    const loggedIn = this.props.loggedIn === undefined ? this.checkAuthTag() : this.props.loggedIn;
    let message;
    if (loggedIn === true) {
      message = 'You are logged in';
    } else if (loggedIn === false) {
      message = 'You are not logged in';
    } else {
      message = 'Checking auth state...';
    }

    const styles = {
      padding: '2em',
      color: 'white',
      backgroundColor: loggedIn === true ? 'blue' : 'red'
    };

    return (
      <div className="row">
        <div className="col-xs" style={styles}>
          <div>{message}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderAuthState()}
        <div className="row">
          <Card className="col-xs">
            <CardTitle title="Auth" subtitle="The auth server is hard coded with one dummy user: 'dummy@user.com' with password 'somepassword'" />
            <CardText>
              <Input type="email" label="E-mail address" value={this.state.email} onChange={this.onInputChange.bind(this, 'email')} />
              <Input type="password" label="Password" value={this.state.password} onChange={this.onInputChange.bind(this, 'password')} />
            </CardText>
            <CardActions>
              <Button label="Login" onClick={::this.login} accent raised />
              <Button label="Logout" onClick={::this.logout} raised />
            </CardActions>
          </Card>
          <Card className="col-xs">
            <CardTitle title="API" subtitle="The API server is configured to reject any requests that do not provide a valid JWT"/>
            <CardActions>
              <Button label="Make request" onClick={::this.makeAuthenticatedRequest} accent raised />
            </CardActions>
          </Card>
        </div>
        <Snackbar
          action="Dismiss"
          active={this.state.snackbarActive}
          label={this.state.snackbarMessage}
          onClick={::this.onSnackbarClick}
          timeout={2000}
          onTimeout={::this.onSnackbarTimeout}
          type="cancel"
        />
      </div>
    );
  }
}
