import { Checker } from '@/classes/Checker'
import { idToStr } from '@/utils'

export class King extends Checker {
    constructor(id, team) {
        super(id, team)
        this.boardCells = []
        this.candidatesId = {}
    }

    getCandidatesIdFromSide(row, rowRecValue, col, colRecValue) {
        const ids = []
        const checkNewCandidateRecursion = (row, col) => {
            this.boardCells.forEach(cell => {
                const id = idToStr(row, col)
                if (cell.dataset.positionid === id) {
                    const checker = cell.children[0]
                    if (checker) {
                        if (+checker.dataset.team !== this.team) {
                            const nextEnemyId = idToStr(row+rowRecValue, col+colRecValue)
                            const nextEnemy =
                                Checker.board.querySelector(`[data-checkerid='${nextEnemyId}']`)
                            if (!nextEnemy) {
                                ids.push(cell.children[0])
                                return checkNewCandidateRecursion(row+rowRecValue, col+colRecValue)
                            }
                        }
                    } else {
                        ids.push(id)
                        return checkNewCandidateRecursion(row+rowRecValue, col+colRecValue)
                    }
                }
            })
        }
        checkNewCandidateRecursion(row+rowRecValue, col+colRecValue)
        return ids
    }

    getCandidatesIdForKing() {
        const candidatesId = {}
        this.boardCells = Array.from(Checker.board.querySelectorAll('[data-color="black"]'))

        candidatesId['bottomleft'] = this.getCandidatesIdFromSide(this.row, 1, this.col, -1)
        candidatesId['bottomright'] = this.getCandidatesIdFromSide(this.row, 1, this.col, +1)
        candidatesId['topleft'] = this.getCandidatesIdFromSide(this.row, -1, this.col, -1)
        candidatesId['topright'] = this.getCandidatesIdFromSide(this.row, -1, this.col, +1)

        return candidatesId
    }

    displayActiveCells() {
        this.candidatesId = this.getCandidatesIdForKing()

        Object.keys(this.candidatesId).forEach(sideName => {
            const side = this.candidatesId[sideName]
            side.forEach(id => {
                if (typeof id === 'string') {
                    this.setMovable(id)
                }
            })
        })
    }

    moveToAndDeleteCheckers(newPosId) {
        this.clearOldCandidates()
        this.insertNewCheckerAndDeleteOld(newPosId, 'king')

        const enemies = []
        Object.keys(this.candidatesId).forEach(sideName => {
            const side = this.candidatesId[sideName]
            side.forEach((id, index) => {
                const cellIsEmpty = typeof id === 'string' && id === newPosId
                if (cellIsEmpty) {
                    const checkersToDelete = side.slice(0, index)
                    checkersToDelete.forEach(checker => {
                        const isChecker = typeof checker !== 'string'
                        if (isChecker) {
                            checker.remove()
                            enemies.push(checker.dataset.checkerid)
                        }
                    })
                }
            })
        })

        return enemies
    }

    getNewEnemies() {
        this.candidatesId = this.getCandidatesIdForKing()
        let ids = []
        Object.keys(this.candidatesId).forEach(sideName => {
            const side = this.candidatesId[sideName]
            side.forEach((id, index) => {
                const isEnemy = typeof id !== 'string' && side[index+1]
                if (isEnemy) {
                    ids = [...ids, ...side]
                    this.areEnemiesToBeat = true
                }
            })
        })
        return ids
    }

    regNewEnemies() {
        const ids = this.getNewEnemies()

        ids.forEach(id => {
            if (typeof id === 'string') {
                this.setMovable(id)
            }
        })

        return this.areEnemiesToBeat
    }
}
