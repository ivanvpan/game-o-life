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
        }
    }

    @action.bound pause() {
        if (this.timer !== null) {
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

        const countNeighbors = (coords: Coordinates): number => {
            let numNeighbors = 0

            for (let yOffset of _.range(-1,2)) {
                for (let xOffset of _.range(-1, 2)) {
                    if (yOffset === 0 && xOffset === 0) continue

                    const x = coords.x + xOffset
                    const y = coords.y + yOffset

                    if (x < 0 || x > this.boardWidth - 1) continue
                    if (y < 0 || y > this.boardHeight - 1) continue

                    if (this.isAlive({x, y})) {
                        numNeighbors++
                    }
                }
            }

            return numNeighbors
        }

        let toDie = new Set<Coordinates>()
        let toLive = new Set<Coordinates>()

        // find the next value for every cell
        forEachAliveCell((coords) => {
            let numNeighbors = countNeighbors(coords)

            if (numNeighbors === 2 || numNeighbors === 3) {
                toLive.add(coords)
            } else {
                toDie.add(coords)
            }
        })

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