import { action, observable, computed, configure } from 'mobx'
import * as _ from 'lodash'

import { Coordinates } from './types'

configure({enforceActions: "always"})


export type CellData = {
    coords: Coordinates
    active: boolean

    /*
    constructor(coords: Coordinates, active = false) {
        this.coords = coords
        this.active = active
    }

    @action toggle() {
        this.active = !this.active
    }
    */
}
class Store {
    @observable cellSize = 12

    boardDimension = 40
    boardWidth = this.boardDimension
    boardHeight = this.boardDimension

    @observable boardValues: CellData[][] = []

    @action init() {
        this.boardValues.length = 0

        for (let yPos of _.range(0, this.boardHeight)) {
            const row = []
            for (let xPos of _.range(0, this.boardWidth)) {
                const coords: Coordinates = {
                    x: xPos,
                    y: yPos
                }
                // const cellData = new CellData(coords)
                const cellData = {
                    coords,
                    active: false
                }
                row.push(cellData)
            }
            this.boardValues.push(row)
        }
    }

    @action toggle(coord: Coordinates) {
        const cellData = this.boardValues[coord.y][coord.x]
        cellData.active = !cellData.active
        // this.boardValues[coord.y][coord.x].active = !this.boardValues[coord.y][coord.x].active
    }

    @action get(coord: Coordinates) {
        return this.boardValues[coord.y][coord.x]
    }
}

export default Store