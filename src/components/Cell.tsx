import React, { Component, DragEvent, MouseEvent } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { observer } from 'mobx-react'

import styleVars from './styleVars'
import { pxStr } from '../utils/string'
import Store, { CellData } from '../store'
import { Coordinates } from '../types'

@observer
class Cell extends Component<Props, {}> {
    onDragStart = (event: DragEvent) => {
        event.preventDefault();
    }

    onMouseDown = (event: MouseEvent) => {
        const LEFT_MOUSE_BUTTON = 0
        if (event.button === LEFT_MOUSE_BUTTON && !event.ctrlKey) {
            this.props.store.toggle(this.props.coords)
        }
    }

    onMouseOver = (event: MouseEvent) => {
        const LEFT_MOUSE_BUTTON_PRESSED = 1
        if (event.buttons === LEFT_MOUSE_BUTTON_PRESSED && ! this.props.store.dragging) {
            this.props.store.dieOrBirth(this.props.coords, false)
        }
    }

    render() {
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

        const innerCellStyle = css(
            dynamicSize.size,
            this.props.store.isAlive(this.props.coords) && styles.activeInnerCell
        )

        return (
            <div className={cellStyle}
                    onDragStart={this.onDragStart}
                    onMouseDown={this.onMouseDown}
                    onMouseOver={this.onMouseOver}>
                <div className={innerCellStyle}>
                </div>
            </div>
        )
    }
}

interface Props {
    coords: Coordinates
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
        backgroundColor: styleVars.colors.green,
        borderRadius: '2px'
    }
})

export default Cell