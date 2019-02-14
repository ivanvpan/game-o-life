import React, { Component, ReactComponentElement, MouseEvent } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { observer } from 'mobx-react'
import _ from 'lodash'

import styleVars from './styleVars'
import Cell from './Cell'
import Store from '../store'

import { pxStr } from '../utils/string'
import { Coordinates } from '../types';

@observer
class Board extends Component<Props, {}>  {
  onMouseDown = (event: MouseEvent) => {
    if (event.ctrlKey && !this.props.store.dragging) {
      this.props.store.startDragging({
        x: event.screenX,
        y: event.screenY,
      })
    }
  }

  // Separate from the handler, because react clears async events
  throttledMouseMove = _.throttle((x: number, y: number) => {
    if (this.props.store.dragging) {
      const coords: Coordinates = { x, y }
      this.props.store.updateDragCoords(coords)
      // console.log('update dragging', this.props.store.dragStartScreenCoords, this.props.store.currentDragScreenCoords)
      console.log('update dragging', this.props.store.dragOffset)
    }
  }, 200)

  onMouseMove = (event: MouseEvent) => {
    this.throttledMouseMove(event.screenX, event.screenY)
  }

  onMouseUp = (event: MouseEvent) => {
    if (this.props.store.dragging) {
      this.props.store.stopDragging()
      console.log('stop dragging')
    }
  }

  onMouseLeave = (event: MouseEvent) => {
    if (this.props.store.dragging) {
      this.props.store.stopDragging()
      console.log('stop dragging')
    }
  }

  render() {
    console.log('rendering board')
    const rows = []
    const worldTopLeft = this.props.store.worldTopLeft
    for (let yPos of _.range(worldTopLeft.y, worldTopLeft.y + this.props.store.boardHeight)) {
      const cells = []
      for (let xPos of _.range(worldTopLeft.x, worldTopLeft.x + this.props.store.boardWidth)) {
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
      <div className={css(styles.board)}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}>
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
    backgroundColor: styleVars.colors.lighterBlack
  },
  row: {
    lineHeight: '0px',
    whiteSpace: 'nowrap'
  }
})


export default Board;
