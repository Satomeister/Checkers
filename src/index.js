import { Board } from '@/classes/Board'

import('./scss/index.scss')

const $startContainer = document.querySelector('.start-container')
const $startButtons = document.querySelectorAll('[data-action="start"]')
const $boardContainer = document.querySelector('.board-container')
const $board = document.querySelector('#board')
const $popup = document.querySelector('.popup-container')

let board

$startButtons.forEach($start => {
    $start.addEventListener('click', () => {
        clear()
        if (board) board.destroy()
        board = new Board($board)
        board.render()
    })
})

function clear() {
    $boardContainer.style.display = 'flex'
    $startContainer.style.display = 'none'
    $popup.style.display = 'none'
}
