import React, { Component, ReactComponentElement } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { observer } from 'mobx-react'

import Store from '../store'
import styleVars from './styleVars'

@observer
class Header extends Component<Props, {}>  {
    render () {
        return  (
            <div className={css(styles.header)}>
                <div className={css(styles.section, styles.logoSection)}>life</div>
                <div className={css(styles.section)} onClick={this.props.store.tick}>S</div>
                <div className={css(styles.section)}>N</div>
            </div>
        )
    }
}

interface Props {
    store: Store
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: styleVars.colors.black,
        fontSize: '40px',
        height: '60px',
        lineHeight: '60px',
    },
    logoSection: {
        color: styleVars.colors.purple,
        cursor: 'normal',
        fontWeight: 'bold',
        padding: '0 50px',
        ':hover': {
            color: styleVars.colors.purple,
        }
    },
    section: {
        color: styleVars.colors.darkGray,
        cursor: 'pointer',
        display: 'inline-block',
        borderRight: `1px solid ${styleVars.borderColor}`,
        padding: '0 20px',
        ':hover': {
            color: styleVars.colors.yellow,
        }
    }
})

export default Header