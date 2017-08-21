import '../Config';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Platform, Linking } from 'react-native';
import RootContainer from './RootContainer';
import createStore from './reducer';

// create our store
const store = createStore();

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  // componentDidMount() {
  //   if (Platform.OS === 'android') {
  //     Linking.getInitialURL().then((url) => {
  //       this.navigate(url);
  //     });
  //   } else {
  //     Linking.addEventListener('url', this.handleOpenURL);
  //   }
  // }

  // componentWillUnmount() {
  //   Linking.removeEventListener('url', this.handleOpenURL);
  // }

  // handleOpenURL = (event) => {
  //   this.navigate(event.url);
  // }

  // navigate = (url) => {
  //   const { navigate } = this.props.navigation;
  //   const route = url.replace(/.*?:\/\//g, '');
  //   const id = route.match(/\/([^\/]+)\/?$/)[1];
  //   const routeName = route.split('/')[0];

  //   if (routeName === 'events') {
  //     navigate('EventDetail', { eventId: id });
  //   }
  // }

  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}

export default App;
