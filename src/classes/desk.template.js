import { isEven } from '@/utils'
import { Checker } from '@/classes/Checker'

const ROWS = 8
const CELLS = 8

function getCellColor(rowIndex, cellIndex) {
    if (isEven(rowIndex + 1)) {
        if (isEven(cellIndex)) {
            return 'black'
        } else {
            return 'white'
        }
    } else {
        if (isEven(cellIndex)) {
            return 'white'
        } else {
            return 'black'
        }
    }
}

function getTeamByIndex(rowIndex) {
    if (rowIndex < 3) return 2
    else if (rowIndex > 4) return 1
}

function createCellAndAddChecker(rowIndex, addChecker) {
    return function(_, cellIndex) {
        const id = `${rowIndex}:${cellIndex}`

        const color = getCellColor(rowIndex, cellIndex)
        const team = getTeamByIndex(rowIndex)

        let checker;
        if (team === 1) {
            if (color === 'black') {
                checker = new Checker(id, 1)
                addChecker(checker)
            }
        } else if (team === 2) {
            if (color === 'black') {
                checker = new Checker(id, 2)
                addChecker(checker)
            }
        }
        const $checker =
            checker ? `<div class="checker" data-checkerid="${id}" data-team="${team}"></div>` : ''
        return `
             <div class="cell" data-positionid="${id}" data-color="${color}">
                ${$checker}
             </div>
        `
    }
}

function createRow(rowIndex, cells) {
    return `
        <div class="row">
            ${cells}
        </div>
    `
}

export function createDesk(addChecker) {
    const rows = []

    for (let row = 0; row < ROWS; row++) {
        const cells = new Array(CELLS)
            .fill('')
            .map(createCellAndAddChecker(row, addChecker))
            .join('')

        rows.push(createRow(row, cells))
    }

    return rows.join('')
}
