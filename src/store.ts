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

    boardDimension = 20
    boardWidth = this.boardDimension
    boardHeight = this.boardDimension

    @observable worldTopLeft: Coordinates = {x: -(this.boardWidth / 2), y: -(this.boardHeight / 2)}

    dragStartScreenCoords: Coordinates|null = null
    currentDragScreenCoords: Coordinates|null = null

    @computed get dragging() {
        return !!this.dragStartScreenCoords
    }

    @computed get dragOffset() {
        if (!this.dragStartScreenCoords || !this.currentDragScreenCoords) {
            return {
                x: 0,
                y: 0
            }
        }

        const toCellPosition = (coord: number) => Math.ceil(coord / this.cellSize)

        return {
            x: toCellPosition(this.currentDragScreenCoords.x - this.dragStartScreenCoords.x),
            y: toCellPosition(this.currentDragScreenCoords.y - this.dragStartScreenCoords.y),
        }
    }

    @action startDragging(screenCoords: Coordinates) {
        if (!this.dragging) {
            this.dragStartScreenCoords = screenCoords
            this.currentDragScreenCoords = screenCoords
        } else {
            console.error('Error: double drag start')
        }
    }

    @action updateDragCoords(screenCoords: Coordinates) {
        if  (this.dragging) {
            this.currentDragScreenCoords = screenCoords
        }
    }

    @action stopDragging() {
        if  (this.dragging) {
            this.dragStartScreenCoords = null
            this.currentDragScreenCoords = null
        }
    }

    @action updateDragPosition(screenCoords: Coordinates) {
    }

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
        this.dieOrBirth(coords, this.isAlive(coords))
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

    @computed get isRunning(): boolean {
        return this.timer !== null
    }

    @action.bound start = () => {
        if (this.timer === null) {
            this.timer = window.setInterval(this.tick, 500)
            console.log('starting timer', this.timer)
        }
    }

    @action.bound pause() {
        console.log('pausing', this.timer)
        if (this.timer) {
            window.clearInterval(this.timer)
            this.timer = null
        }
    }

    @action.bound tick() {
        const forEachAliveCell = (cb: (coords: Coordinates) => void): void => {
            for (let [y, row] of this.boardValues) {
                for (let [x, _] of row) {
                    cb({x, y})
                }
            }
        }

        const forEachNeighbor = (coords: Coordinates, cb: (coords: Coordinates) => void) => {
            for (let yOffset of _.range(-1,2)) {
                for (let xOffset of _.range(-1, 2)) {
                    if (yOffset === 0 && xOffset === 0) continue

                    const x = coords.x + xOffset
                    const y = coords.y + yOffset

                    cb({x, y})
                }
            }
        }

        let toDie = new Set<Coordinates>()
        let toLive = new Set<Coordinates>()

        let deadNeighbors = new Set<string>()

        // find the next value for every cell
        forEachAliveCell((coords) => {
            let numNeighbors = 0

            forEachNeighbor(coords, (coords) => {
                if (this.isAlive(coords)) {
                    numNeighbors++
                } else {
                    deadNeighbors.add(`${coords.x} ${coords.y}`)
                }
            })

            if (numNeighbors === 2 || numNeighbors === 3) {
                toLive.add(coords)
            } else {
                toDie.add(coords)
            }
        })

        // check non-live cells
        for (let deadCell of deadNeighbors) {
            let [xStr, yStr] = deadCell.split(' ')
            let coords = {x: Number(xStr), y: Number(yStr)}
            let numNeighbors = 0

            forEachNeighbor(coords, (coords) => {
                if (this.isAlive(coords)) {
                    numNeighbors++
                }
            })

            if (numNeighbors === 3) {
                toLive.add(coords)
            }
        }

        // Save results
        for (let live of toLive) {
            this.dieOrBirth(live, false)
        }

        for (let die of toDie) {
            this.dieOrBirth(die, true)
        }
    }
}

export default Store
