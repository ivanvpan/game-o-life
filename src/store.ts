import { action, observable, computed, configure } from 'mobx'
import * as _ from 'lodash'

configure({enforceActions: "always"})

class Store {
    @observable cellSize = 5

    boardWidth = 10
    boardHeight = 10

    @observable boardValues: boolean[][] = []

    @action init() {
        this.boardValues.length = 0

        for (let yPos of _.range(0, this.boardHeight)) {
            const row = _.fill(Array(this.boardWidth), false, 0, this.boardWidth)
            this.boardValues.push(row)
        }
    }

    @action toggle(xPos: number, yPos: number) {
        this.boardValues[yPos][xPos] = !this.boardValues[yPos][xPos]
    }
}

export default Store