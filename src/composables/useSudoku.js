import { ref, computed } from 'vue'

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false
    if (board[i][col] === num && i !== row) return false
  }
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num && (boxRow + i !== row || boxCol + j !== col)) {
        return false
      }
    }
  }
  return true
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num
            if (solveSudoku(board)) return true
            board[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function generateSudoku(difficulty) {
  const board = Array(9).fill(null).map(() => Array(9).fill(0))
  solveSudoku(board)

  const solution = board.map(row => [...row])

  let attempts = { easy: 30, medium: 45, hard: 55 }[difficulty] || 45

  for (let i = 0; i < attempts; i++) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (board[row][col] !== 0) {
      board[row][col] = 0
    }
  }

  return { initial: board.map(row => [...row]), solution }
}

export function useSudoku() {
  const board = ref([])
  const initialBoard = ref([])
  const solution = ref([])
  const selectedCell = ref(null)
  const notesMode = ref(false)
  const conflicts = ref(new Set())
  const gameStarted = ref(false)
  const gameCompleted = ref(false)
  const difficulty = ref('medium')
  const elapsedSeconds = ref(0)
  const timerInterval = ref(null)

  const formattedTime = computed(() => {
    const mins = Math.floor(elapsedSeconds.value / 60)
    const secs = elapsedSeconds.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  function startGame(diff = difficulty.value) {
    difficulty.value = diff
    const { initial, solution: sol } = generateSudoku(diff)
    board.value = initial.map(row => [...row])
    initialBoard.value = initial.map(row => [...row])
    solution.value = sol
    selectedCell.value = null
    conflicts.value = new Set()
    gameStarted.value = true
    gameCompleted.value = false
    elapsedSeconds.value = 0

    if (timerInterval.value) clearInterval(timerInterval.value)
    timerInterval.value = setInterval(() => {
      elapsedSeconds.value++
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  function selectCell(row, col) {
    if (initialBoard.value[row][col] === 0) {
      selectedCell.value = { row, col }
    }
  }

  function fillCell(num) {
    if (!selectedCell.value || gameCompleted.value) return
    const { row, col } = selectedCell.value
    if (initialBoard.value[row][col] !== 0) return

    if (notesMode.value) {
      const currentNotes = getCellNotes(row, col)
      if (currentNotes.has(num)) {
        currentNotes.delete(num)
      } else {
        currentNotes.add(num)
      }
      board.value[row][col] = Array(10).fill(0).map((_, i) => currentNotes.has(i) ? i : 0)
    } else {
      board.value[row][col] = num
      checkConflicts()
      checkWin()
    }
  }

  function clearCell() {
    if (!selectedCell.value || gameCompleted.value) return
    const { row, col } = selectedCell.value
    if (initialBoard.value[row][col] !== 0) return

    board.value[row][col] = 0
    checkConflicts()
  }

  function getCellNotes(row, col) {
    const cell = board.value[row][col]
    if (typeof cell === 'number') return new Set()
    const notes = new Set()
    cell.forEach((n, i) => {
      if (n !== 0) notes.add(i)
    })
    return notes
  }

  function checkConflicts() {
    conflicts.value.clear()
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = board.value[row][col]
        if (num !== 0 && typeof num === 'number') {
          if (!isValid(board.value, row, col, num)) {
            conflicts.value.add(`${row}-${col}`)
          }
        }
      }
    }
  }

  function checkWin() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board.value[row][col] === 0) return
        if (board.value[row][col] !== solution.value[row][col]) return
      }
    }
    gameCompleted.value = true
    stopTimer()
  }

  function getCellClass(row, col) {
    const classes = []
    const isFixed = initialBoard.value[row][col] !== 0
    const isSelected = selectedCell.value?.row === row && selectedCell.value?.col === col
    const num = board.value[row][col]
    const isConflict = conflicts.value.has(`${row}-${col}`)

    if (isFixed) classes.push('fixed')
    if (isSelected) classes.push('selected')
    if (selectedCell.value && !isSelected) {
      const selectedNum = board.value[selectedCell.value.row]?.[selectedCell.value.col]
      if (typeof selectedNum === 'number' && selectedNum !== 0 && num === selectedNum) {
        classes.push('highlight')
      }
      if (row === selectedCell.value.row || col === selectedCell.value.col) {
        classes.push('highlight')
      }
    }
    if (isConflict && !isFixed) classes.push('conflict')

    return classes.join(' ')
  }

  function isNoteModeCell(row, col) {
    return typeof board.value[row]?.[col] !== 'number'
  }

  return {
    board,
    initialBoard,
    selectedCell,
    notesMode,
    conflicts,
    gameStarted,
    gameCompleted,
    difficulty,
    elapsedSeconds,
    formattedTime,
    startGame,
    stopTimer,
    selectCell,
    fillCell,
    clearCell,
    getCellNotes,
    getCellClass,
    isNoteModeCell
  }
}
