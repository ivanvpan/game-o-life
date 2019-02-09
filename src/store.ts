import { action, observable, computed, configure } from 'mobx'
import * as _ from 'lodash'

import { Coordinates } from './types'
import { runInThisContext } from 'vm';

configure({enforceActions: "always"})

export class CellData {
    coords: Coordinates

    constructor(coords: Coordinates, active = false) {
        this.coords = coords
    }
}

class Store {
    @observable cellSize = 13

    boardDimension = 50
    boardWidth = this.boardDimension
    boardHeight = this.boardDimension

    @observable timer: number|null = null

    // @observable boardValues: Map<number, Map<number, CellData>> = new Map()
    @observable boardValues: Map<number, Map<number, true>> = new Map()

    @action init() {
        this.boardValues.clear()
    }

    @observable isAlive(coords: Coordinates) {
        const row = this.boardValues.get(coords.y)
        return (!!row) && row.has(coords.x)
    }

    @action toggle(coords: Coordinates) {
        // this.dieOrBirth(coords, this.isAlive(coords))
        this.dieOrBirth(coords, false)
    }

    @action dieOrBirth(coords: Coordinates, die: boolean) {
        let row = this.boardValues.get(coords.y)

        if (die) {
            if (!row) {
                return
            } else {
                row.delete(coords.x)
                if (row.size < 1) {
                    this.boardValues.delete(coords.y)
                }
            }
        } else {
            if (!row) {
                row = observable(new Map())
                this.boardValues.set(coords.y, row)
            }
            row.set(coords.x, true)
        }
    }

    /*
    @computed get isRunning(): boolean {
        return this.timer !== null
    }

    @action.bound start = () => {
        if (this.timer === null) {
            this.timer = window.setInterval(this.tick, 500)
        }
    }

    @action.bound pause() {
        if (this.timer !== null) {
            window.clearInterval(this.timer)
            this.timer = null
        }
    }

    @action.bound tick() {
        const forEachCell = (cb: (cellData: CellData) => void): void => {
            for (let row of this.boardValues) {
                for (let cellData of row) {
                    cb(cellData)
                }
            }
        }

        const countNeighbors = (coords: Coordinates): number => {
            let numNeighbors = 0

            for (let yOffset of _.range(-1,2)) {
                for (let xOffset of _.range(-1, 2)) {
                    if (yOffset === 0 && xOffset === 0) continue

                    const x = coords.x + xOffset
                    const y = coords.y + yOffset

                    if (x < 0 || x > this.boardWidth - 1) continue
                    if (y < 0 || y > this.boardHeight - 1) continue

                    if (this.boardValues[y][x].active) {
                        numNeighbors++
                    }
                }
            }

            return numNeighbors
        }

        // find the next value for every cell
        forEachCell((cellData) => {
            const coords = cellData.coords
            let numNeighbors = countNeighbors(coords)
            if (cellData.active) {
                cellData.setNextValue(numNeighbors === 3 || numNeighbors === 2)
            } else {
                cellData.setNextValue(numNeighbors === 3)
            }
        })

        // set the next value to the current value
        forEachCell((cellData) => {
            cellData.tick()
        })
    }
    */
}

export default Store