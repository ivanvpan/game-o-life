import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Layout from './components/Layout';
// import * as serviceWorker from './serviceWorker';

import Store from './store'

const appStore = new Store()
appStore.init()

ReactDOM.render(<Layout store={appStore}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
