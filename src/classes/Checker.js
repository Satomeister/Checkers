import { idToStr, parseId } from '@/utils'

export class Checker {
    static board = document.querySelector('#board')

    constructor(id, team) {
        this.id = id
        this.team = team
        this.col = parseId(this.id).col
        this.row = parseId(this.id).row
        this.areEnemiesToBeat = false
        this.enemys = []
    }

    clearOldCandidates() {
        Checker.board.querySelectorAll('.candidate')
            .forEach($el => $el.classList.remove('candidate'))
        Checker.board.querySelectorAll('[data-movable]')
            .forEach($el => $el.removeAttribute('data-movable'))
        Checker.board.querySelectorAll('[data-beatable]')
            .forEach($el => $el.removeAttribute('data-beatable'))
        this.enemys = []
        this.areEnemiesToBeat = false
    }

    displayActiveCellsForEnemies(enemyCol, enemyRow) {
        const { row, col } = parseId(this.id)
        const newIds = []

        if (enemyCol < col && enemyRow < row) {
            newIds.push(idToStr(row-2, col-2))
        } else if (enemyCol > col && enemyRow < row) {
            newIds.push(idToStr(row-2, col+2))
        }
        if (enemyCol < col && enemyRow > row) {
            newIds.push(idToStr(row+2, col-2))
        } else if (enemyCol > col && enemyRow > row) {
            newIds.push(idToStr(row+2, col+2))
        }

        newIds.forEach(id => {
            const $candidate = Checker.board.querySelector(`[data-positionid='${id}']`)
            const isMovable = $candidate && $candidate.children.length === 0
            if (isMovable) {
                this.areEnemiesToBeat = true
                $candidate.classList.add('candidate')
                $candidate.setAttribute('data-beatable', 'beatable')
            }
        })
    }

    displayActiveCells() {
        this.findEnemiesAndDisplayCells()
        const candidatesId = this.team === 1 ?
            [idToStr(this.row-1, this.col-1), idToStr(this.row-1, this.col+1)] :
            [idToStr(this.row+1, this.col-1), idToStr(this.row+1, this.col+1)]

        candidatesId.forEach(id => {
            this.setMovable(id)
        })
    }

    setMovable(id) {
        const $candidate = Checker.board.querySelector(`[data-positionid='${id}']`)
        const isMovable = $candidate && $candidate.children.length === 0
        if (isMovable) {
            $candidate.classList.add('candidate')
            $candidate.setAttribute('data-movable', 'movable')
        }
    }

    findEnemiesAndDisplayCells() {
        const enemiesId =
            [
                idToStr(this.row-1, this.col-1),
                idToStr(this.row-1, this.col+1),
                idToStr(this.row+1, this.col-1),
                idToStr(this.row+1, this.col+1)
            ]
        enemiesId.forEach(id => {
            const $candidate = Checker.board.querySelector(`[data-positionid='${id}']`)
            const enemy =
                $candidate &&
                $candidate.children[0] &&
                +$candidate.children[0].dataset.team !== this.team &&
                $candidate.children[0]

            if (enemy) {
                const { row, col } = parseId(id)
                this.enemys.push({ row, col })
                this.displayActiveCellsForEnemies(col, row)
            }
        })
    }

    showCandidates() {
        this.clearOldCandidates()
        this.displayActiveCells()
    }

    deleteOldChecker() {
        const $checkerContainer =
            Checker.board.querySelector(`[data-positionid='${this.id}']`)
        $checkerContainer.children[0].remove()
    }

    moveTo(newPosId) {
        this.clearOldCandidates()
        this.insertNewCheckerAndDeleteOld(newPosId)
    }

    insertNewCheckerAndDeleteOld(newPosId, classes) {
        const $newPos = Checker.board.querySelector(`[data-positionid='${newPosId}']`)
        const $checker = `<div
            class="checker ${classes}"
            data-checkerid="${newPosId}"
            data-team="${this.team}"
            ></div>`
        $newPos.insertAdjacentHTML('afterbegin', $checker)
        $newPos.setAttribute('data-team', `${this.team}`)
        this.deleteOldChecker()
        this.updateId(newPosId)
    }

    regNewEnemies() {
        this.findEnemiesAndDisplayCells()
        return this.areEnemiesToBeat
    }

    updateId(id) {
        this.id = id
        this.row = parseId(id).row
        this.col = parseId(id).col
    }

    findCheckerToBeat(id) {
        const { row, col } = parseId(id)
        let enemyToBeat = {}
        this.enemys.forEach(enemy => {
            if (enemy.row > this.row && enemy.col > this.col &&
                row > this.row && col > this.col) {
                enemyToBeat = enemy
            } else if (enemy.row > this.row && enemy.col < this.col &&
                row > this.row && col < this.col) {
                enemyToBeat = enemy
            } else if (enemy.row < this.row && enemy.col > this.col &&
                row < this.row && col > this.col) {
                enemyToBeat = enemy
            } else if (enemy.row < this.row && enemy.col < this.col &&
                row < this.row && col < this.col) {
                enemyToBeat = enemy
            }
        })
        return enemyToBeat
    }

    beatAndMoveTo(newPosId) {
        const enemy = this.findCheckerToBeat(newPosId)
        const selector = `[data-checkerid='${idToStr(enemy.row, enemy.col)}']`
        const $enemy = Checker.board.querySelector(selector)
        $enemy.remove()
        this.moveTo(newPosId)
        return $enemy.dataset.checkerid
    }
}
