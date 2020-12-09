export function isEven(n) {
    return n % 2 === 0
}

export function parseId(id) {
    id = id.split(':')
    return {
        row: +id[0],
        col: +id[1]
    }
}

export function idToStr(row, col) {
    return `${row}:${col}`
}
