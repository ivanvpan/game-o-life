import React, { Component, ReactComponentElement } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { observer } from 'mobx-react'

import Store from '../store'
import styleVars from './styleVars'

@observer
class Header extends Component<Props, {}>  {
    render () {
        return <div className={css(styles.header)}></div>
    }
}

interface Props {
    store: Store
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: styleVars.colors.black,
        height: '60px',
        lineHeight: '60px',
        width: '100%'
    }
})

export default Header