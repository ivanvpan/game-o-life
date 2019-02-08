import React, { Component, ReactComponentElement } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { observer } from 'mobx-react'

import styleVars from './styleVars'
import Cell from './Cell'
import Store from '../store'

import { pxStr } from '../utils/string'

@observer
class Board extends Component<Props, {}>  {
  render() {
    console.log('rendering board')
    const rows = this.props.store.boardValues.map((rowValues, rowNumber) => {
      const cells: ReactComponentElement<any, any>[] = []

      rowValues.forEach((cellData) => {
        const key = `${cellData.coords.x},${cellData.coords.y}`
        const cell = <Cell coords={cellData.coords} store={this.props.store} key={key}/>
        cells.push(cell)
      })

      return  (
        <div className={css(styles.row)} key={rowNumber}>
          { cells }
        </div>
      )
    })

    return (
      <div className={css(styles.board)}>
        { rows }
      </div>
    );
  }
}

interface Props {
  store: Store
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: styleVars.colors.lighterBlack,
  },
  row: {
    lineHeight: '0px',
    whiteSpace: 'nowrap'
  }
})


export default Board;
