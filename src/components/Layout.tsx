import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import Store from '../store'
import Board from './Board'
import Header from './Header'

class Layout extends Component<Props, {}> {
    render() {
        return (
            <div>
                <Header store={this.props.store}/>
                <Board store={this.props.store}/>
            </div>
        )
    }
}

interface Props {
  store: Store
}

export default Layout