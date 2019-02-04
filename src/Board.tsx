import React, { Component, ReactComponentElement } from 'react';
import './Board.css';

import { observer } from 'mobx-react'
import Cell from './Cell'
import Store from './store'

@observer
class Board extends Component<Props, {}>  {
  render() {
    const rows = this.props.store.boardValues.map((rowValues, yPos) => {
      const cells: ReactComponentElement<any, any>[] = []

      rowValues.forEach((cellValue, xPos) => {
        const onClick = (event: MouseEvent) => this.props.store.toggle(xPos, yPos)
        const cell = <Cell active={cellValue} onClick={onClick} />
        cells.push(cell)
      })

      return  (
        <div className='row'>
          { cells }
        </div>
      )
    })

    return (
      <div className="Board">
        { rows }
      </div>
    );
  }
}

interface Props {
  store: Store
}

export default Board;
