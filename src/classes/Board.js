import { createDesk } from '@/classes/desk.template'
import { parseId } from '@/utils'
import { King } from '@/classes/King'
const $whiteQuantity = document.querySelector('#white')
const $blackQuantity = document.querySelector('#black')
const $teamInfo = document.querySelector('#team')
const $popup = document.querySelector('.popup-container')
const $loser = document.querySelector('#loser')

export class Board {
    constructor($root) {
        this.$root = $root
        this.checkers = []
        this.activeChecker = null
        this.initDomListeners()
        this.currentTeam = 1
        this.areEnemiesToBeat = false
    }

    initDomListeners() {
        this.onCLick = this.onCLick.bind(this)
        this.$root.addEventListener('click', this.onCLick)
    }

    addChecker(checker) {
        this.checkers.push(checker)
    }

    createHTML() {
        return createDesk(this.addChecker.bind(this))
    }

    render() {
        this.$root.innerHTML = this.createHTML()
        $teamInfo.innerHTML = 'White is moving'
        $whiteQuantity.innerHTML = '12'
        $blackQuantity.innerHTML = '12'
    }

    destroy() {
        this.$root.removeEventListener('click', this.onCLick)
    }

    nextPlayer() {
        this.currentTeam = this.currentTeam === 1 ? 2 : 1
        if (!this.areCheckers()) {
            this.endGame()
        }
        const color = this.currentTeam === 1 ? 'White' : 'Black'
        $teamInfo.innerHTML = `${color} is moving`
    }

    areCheckers() {
        const teamCheckers = this.checkers.filter(checker => checker.team === this.currentTeam)
        return teamCheckers.length !== 0
    }

    endGame() {
        const color = this.currentTeam === 1 ? 'White' : 'Black'
        $loser.innerHTML = `${color} loses at this game`
        $popup.style.display = 'flex'
        debugger
    }

    onCLick(event) {
        const $target = event.target
        const checkerId = $target.dataset.checkerid
        const positionId = $target.dataset.positionid

        const teamCheckers = this.getCurrentTeamCheckers()

        if (checkerId && !this.areEnemiesToBeat) {
            teamCheckers.forEach(checker => {
                if (checker.id === checkerId) {
                    this.activeChecker = checker
                    checker.showCandidates()
                }
            })
        }
        const isMovable = $target.dataset.movable === 'movable'
        if (isMovable) {
            const isKing = this.activeChecker instanceof King
            if (isKing) {
                const enemies = this.activeChecker.moveToAndDeleteCheckers(positionId)
                this.deleteCheckers(enemies)
                if (enemies.length > 0) {
                    this.checkNewEnemies()
                }
            } else {
                this.activeChecker.moveTo(positionId)
                this.areEnemiesToBeat = false
                this.nextPlayer()
            }
            if (this.isNewPositionKing(positionId)) {
                this.createKing()
            }
        }
        const isBeatable = $target.dataset.beatable === 'beatable'
        if (isBeatable) {
            const enemyId = this.activeChecker.beatAndMoveTo(positionId)
            this.deleteCheckers(enemyId)
            if (this.isNewPositionKing(positionId)) {
                this.createKing()
            }
            this.checkNewEnemies()
        }
    }

    isNewPositionKing(positionId) {
        const FIRST_LINE = 0
        const LAST_LINE = 7
        const isAlreadyKing = this.activeChecker instanceof King

        if (parseId(positionId).row === FIRST_LINE) {
            return this.activeChecker.team === 1 && !isAlreadyKing
        } else if (parseId(positionId).row === LAST_LINE) {
            return this.activeChecker.team === 2 && !isAlreadyKing
        }
        return false
    }

    createKing() {
        this.checkers = this.checkers.map(checker => {
            if (checker.id === this.activeChecker.id) {
                const king = new King(checker.id, checker.team)
                this.activeChecker = king
                const selector = `[data-checkerid='${this.activeChecker.id}']`
                const $king = this.$root.querySelector(selector)
                $king.classList.add('king')
                return king
            }
            return checker
        })
    }

    checkNewEnemies() {
        const areEnemies = this.activeChecker.regNewEnemies()
        if (!areEnemies) {
            this.areEnemiesToBeat = false
            this.nextPlayer()
        } else {
            this.areEnemiesToBeat = true
        }
    }

    deleteCheckers(enemies = []) {
        if (typeof enemies === 'string') {
            this.checkers = this.checkers.filter(checker => checker.id !== enemies)
        } else {
            enemies.forEach(id => {
                this.checkers = this.checkers.filter(checker => checker.id !== id)
            })
        }
        const whiteQuantity = this.checkers.filter(checker => +checker.team === 1).length
        $whiteQuantity.innerHTML = `${whiteQuantity}`
        const blackQuantity = this.checkers.filter(checker => +checker.team === 2).length
        $blackQuantity.innerHTML = `${blackQuantity}`
    }

    getCurrentTeamCheckers() {
        return this.checkers.filter(checker => checker.team === this.currentTeam)
    }
}
