import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { Layout } from './components/Layout';
import getFirebaseApp from './firebase';
import { updateAuthState } from './actions/user';

import './css/app.css';

const firebase = getFirebaseApp();
const logger = createLogger();
const store = createStore(
  reducers,
  {},
  applyMiddleware(logger, thunk),
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
    };
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.dispatch(updateAuthState(true));
      } else {
        store.dispatch(updateAuthState(false));
      }
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
  }
}

export default withRouter(App);
