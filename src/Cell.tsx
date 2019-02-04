import React, { Component } from 'react';
import './Cell.css'

class Cell extends Component<Props, {}> {
    render() {
        let className = 'Cell'
        className += this.props.active ? ' active' : ''

        return <div className={className} onClick={this.props.onClick}></div>
    }
}

interface Props {
    active: boolean
    onClick: (event: any) => any
}

export default Cell