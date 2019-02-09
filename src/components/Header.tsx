import React, { Component, ReactComponentElement } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { observer } from 'mobx-react'

import Store from '../store'
import styleVars from './styleVars'

@observer
class Header extends Component<Props, {}>  {
    render () {
    //     return  (
    //         <div className={css(styles.header)}>
    //             <div className={css(styles.logoSection)}>life</div>
    //             { this.props.store.isRunning ? (
    //                 <div className={css(styles.button, styles.pause)} onClick={this.props.store.pause}>
    //                     <span className="typcn typcn-media-pause-outline"></span>
    //                 </div>
    //             ) : (
    //                 <div className={css(styles.button)} onClick={this.props.store.start}>
    //                     <span className="typcn typcn-media-play-outline"></span>
    //                 </div>
    //             )}
    //             <div className={css(styles.button)} onClick={this.props.store.tick}>
    //                 <span className="typcn typcn-chevron-right-outline"></span>
    //             </div>
    //         </div>
    //     )
        return <div/>
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
        borderRight: `1px solid ${styleVars.colors.lighterBlack}`,
        color: styleVars.colors.purple,
        display: 'inline-block',
        fontWeight: 'bold',
        padding: '0 50px',
    },
    button: {
        borderRight: `1px solid ${styleVars.colors.lighterBlack}`,
        color: styleVars.colors.gray,
        display: 'inline-block',
        cursor: 'pointer',
        padding: '0 15px',
        ':hover': {
            color: styleVars.colors.blue,
            backgroundColor: styleVars.colors.lighterBlack
        }
    },
    pause: {
        color: styleVars.colors.blue,
    }
})

export default Header