import React, { Component, ReactComponentElement } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { observer } from 'mobx-react'
import _ from 'lodash'

import styleVars from './styleVars'
import Cell from './Cell'
import Store from '../store'

import { pxStr } from '../utils/string'

@observer
class Board extends Component<Props, {}>  {
  render() {
    console.log('rendering board')
    const rows = []
    for (let yPos of _.range(0, this.props.store.boardHeight)) {
      const cells = []
      for (let xPos of _.range(0, this.props.store.boardWidth)) {
        const key = `${xPos},${yPos}`
        const coords = { // TODO: make constructor?
          x: xPos,
          y: yPos
        }
        const cell = <Cell
          coords={coords}
          store={this.props.store}
          key={key}/>
        cells.push(cell)
      }

      rows.push(
        <div className={css(styles.row)} key={yPos}>
          { cells }
        </div>
      )
    }

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
