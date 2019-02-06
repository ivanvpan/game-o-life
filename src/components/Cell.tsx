import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { observer } from 'mobx-react'

import styleVars from './styleVars'
import { pxStr } from '../utils/string'
import Store, { CellData } from '../store'

@observer
class Cell extends Component<Props, {}> {
    render() {
        console.log('rendering cell')
        const size = this.props.store.cellSize
        const dynamicSize = StyleSheet.create({
            size: {
                lineHeight: pxStr(size),
                height: pxStr(size),
                width: pxStr(size)
            }
        })

        const cellStyle = css(
            styles.cell,
            dynamicSize.size,
        )

        const innerCellStyle =css(
            dynamicSize.size,
            this.props.cellData.active && styles.activeInnerCell
        )

        return (
            <div className={cellStyle} onClick={this.props.cellData.toggle}>
                <div className={innerCellStyle}>
                </div>
            </div>
        )
    }
}

interface Props {
    cellData: CellData
    store: Store
}

const styles = StyleSheet.create({
    cell: {
        display: 'inline-block',
        backgroundColor: styleVars.colors.lighterBlack,
        borderRight: `1px solid ${styleVars.borderColor}`,
        borderBottom: `1px solid ${styleVars.borderColor}`,
    },
    innerCell: {
        backgroundColor: 'none'
    },
    activeInnerCell: {
        backgroundColor: '#8afe91',
        borderRadius: '2px'
    }
})

export default Cell