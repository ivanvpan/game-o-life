import { action, observable, computed, configure } from 'mobx'
import * as _ from 'lodash'

import { Coordinates } from './types'

configure({enforceActions: "always"})

export class CellData {
    coords: Coordinates
    @observable active: boolean
    nextValue: boolean

    constructor(coords: Coordinates, active = false) {
        this.coords = coords
        this.active = active
        this.nextValue = false
    }

    @action.bound toggle() {
        this.active = !this.active
    }

    @action.bound activate() {
        this.active = true
    }

    @action.bound setNextValue(value: boolean) {
        this.nextValue = value
    }

    @action.bound tick() {
        this.active = this.nextValue
    }
}
class Store {
    @observable cellSize = 13

    boardDimension = 50
    boardWidth = this.boardDimension
    boardHeight = this.boardDimension

    @observable timer: number|null = null

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
                const cellData = new CellData(coords)
                row.push(cellData)
            }
            this.boardValues.push(row)
        }
    }

    getPosition(coords: Coordinates) {
        return this.boardValues[coords.y][coords.x]
    }

    @action toggle(coords: Coordinates) {
        this.getPosition(coords).toggle()
    }

    @action activate(coords: Coordinates) {
        this.getPosition(coords).activate()
    }

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
}

export default Store