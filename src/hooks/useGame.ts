import type { ISquare } from '@/types/Square'
import { computed, onMounted, ref } from 'vue'

export const useGame = (numRows: number, numCols: number, numMines: number) => {
  const board = ref<ISquare[][]>([])
  const flags = ref(0)
  const correctFlags = ref(0)
  const isLose = ref(false)
  const gameStatus = computed<GameStatus>(() =>
    flags.value === correctFlags.value && correctFlags.value === numMines
      ? 'win'
      : isLose.value
        ? 'lose'
        : 'play'
  )

  const restart = () => {
    initializeBoard()
    flags.value = 0
    correctFlags.value = 0
    isLose.value = false
  }

  function openMineWhenLose() {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (board.value[i][j].isBomb) {
          board.value[i][j].isOpen = true
        }
      }
    }
  }

  function initializeBoard() {
    let index = 0
    for (let i = 0; i < numRows; i++) {
      board.value[i] = []
      for (let j = 0; j < numCols; j++) {
        index++
        board.value[i][j] = {
          id: index,
          isOpen: false,
          value: i,
          row: i,
          col: j,
          isBomb: false,
          isFlagged: false
        }
      }
    }

    let minesPlaced = 0
    while (minesPlaced < numMines) {
      const row = Math.floor(Math.random() * numRows)
      const col = Math.floor(Math.random() * numCols)
      if (!board.value[row][col].isBomb) {
        board.value[row][col].isBomb = true
        minesPlaced++
      }
    }

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (!board.value[i][j].isBomb) {
          let count = 0
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const ni = i + dx
              const nj = j + dy
              if (
                ni >= 0 &&
                ni < numRows &&
                nj >= 0 &&
                nj < numCols &&
                board.value[ni][nj].isBomb
              ) {
                count++
              }
            }
          }
          board.value[i][j].value = count
        }
      }
    }
  }

  const flagSquare = (row: number, col: number) => {
    if (
      row < 0 ||
      row >= numRows ||
      col < 0 ||
      col >= numCols ||
      board.value[row][col].isOpen ||
      isLose.value ||
      gameStatus.value != 'play'
    ) {
      return
    }

    if (board.value[row][col].isFlagged) {
      board.value[row][col].isFlagged = false
      flags.value -= 1
    } else {
      board.value[row][col].isFlagged = true
      flags.value += 1
    }

    if (board.value[row][col].isBomb) {
      if (board.value[row][col].isFlagged) correctFlags.value += 1
      else {
        correctFlags.value -= 1
      }
    }
  }

  const openSquare = (row: number, col: number) => {
    if (
      row < 0 ||
      row >= numRows ||
      col < 0 ||
      col >= numCols ||
      board.value[row][col].isOpen ||
      isLose.value ||
      gameStatus.value != 'play'
    ) {
      return
    }

    board.value[row][col].isOpen = true

    if (board.value[row][col].isBomb) {
      isLose.value = true
      openMineWhenLose()
    } else if (board.value[row][col].value === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          openSquare(row + dx, col + dy)
        }
      }
    }
  }

  onMounted(() => initializeBoard())

  return {
    board,
    isLose,
    gameStatus,
    openSquare,
    flagSquare,
    restart
  }
}
