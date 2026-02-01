<script setup>
import { useSudoku } from './composables/useSudoku'
import { ref, watch } from 'vue'

const {
  board,
  selectedCell,
  notesMode,
  conflicts,
  gameStarted,
  gameCompleted,
  difficulty,
  formattedTime,
  startGame,
  selectCell,
  fillCell,
  clearCell,
  getCellNotes,
  getCellClass,
  isNoteModeCell
} = useSudoku()

const showDifficultyModal = ref(true)
const showWinModal = ref(false)

watch(gameCompleted, (val) => {
  if (val) showWinModal.value = true
})

const difficulties = [
  { value: 'easy', label: '简单', hint: 45 },
  { value: 'medium', label: '中等', hint: 35 },
  { value: 'hard', label: '困难', hint: 25 }
]

function selectDifficulty(diff) {
  difficulty.value = diff
  showDifficultyModal.value = false
  startGame(diff)
}

function newGame() {
  showWinModal.value = false
  showDifficultyModal.value = true
}

function restart() {
  showWinModal.value = false
  startGame(difficulty.value)
}

function handleKeydown(e) {
  if (!gameStarted.value || gameCompleted.value) return

  if (e.key >= '1' && e.key <= '9') {
    fillCell(parseInt(e.key))
  } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
    clearCell()
  } else if (e.key === 'n' || e.key === 'N') {
    notesMode.value = !notesMode.value
  } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
    moveSelection(e.key)
  }
}

function moveSelection(key) {
  if (!selectedCell.value) {
    selectCell(0, 0)
    return
  }

  let { row, col } = selectedCell.value

  switch(key) {
    case 'ArrowUp': row = Math.max(0, row - 1); break
    case 'ArrowDown': row = Math.min(8, row + 1); break
    case 'ArrowLeft': col = Math.max(0, col - 1); break
    case 'ArrowRight': col = Math.min(8, col + 1); break
  }

  selectCell(row, col)
}

window.addEventListener('keydown', handleKeydown)
</script>

<template>
  <div class="relative min-h-screen w-full flex flex-col items-center py-8">
    <div class="background-grid absolute inset-0 pointer-events-none"></div>

    <div class="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg px-4">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple glow-text">
          SUDOKU
        </h1>
        <p class="text-cyber-blue/60 text-sm mt-1">数独挑战</p>
      </div>

      <div v-if="gameStarted" class="w-full flex items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <span class="text-cyber-blue/60">⏱</span>
          <span class="text-xl font-mono text-cyber-blue">{{ formattedTime }}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-cyber-blue/60">笔记模式</span>
          <button
            @click="notesMode = !notesMode"
            :class="['w-12 h-7 rounded-full transition-all duration-300 relative', notesMode ? 'bg-cyber-blue' : 'bg-cyber-blue/20']"
          >
            <div
              :class="['w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-300', notesMode ? 'left-6' : 'left-1']"
            ></div>
          </button>
        </div>
      </div>

      <div v-if="gameStarted" class="w-full">
        <div class="bg-panel-bg/80 backdrop-blur rounded-2xl p-3 border border-cyber-blue/20 shadow-[0_0_30px_rgba(0,212,255,0.1)]">
          <div class="grid grid-cols-9 gap-0">
            <div
              v-for="(row, rIndex) in board"
              :key="rIndex"
              class="contents"
            >
              <div
                v-for="(_, cIndex) in row"
                :key="`${rIndex}-${cIndex}`"
                :class="['sudoku-cell aspect-square text-xl',
                  (cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'border-r-2' : 'border-r',
                  (rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'border-b-2' : 'border-b',
                  getCellClass(rIndex, cIndex)
                ]"
                @click="selectCell(rIndex, cIndex)"
              >
                <template v-if="isNoteModeCell(rIndex, cIndex)">
                  <div class="notes-grid">
                    <span v-for="n in 9" :key="n" class="text-[8px] text-cyber-blue/70 text-center leading-[1]">
                      {{ getCellNotes(rIndex, cIndex).has(n) ? n : '' }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <span :class="[
                    'transition-all duration-200',
                    board[rIndex][cIndex] !== 0 ? 'opacity-100' : 'opacity-0'
                  ]">
                    {{ board[rIndex][cIndex] || '' }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="gameStarted && !gameCompleted" class="w-full grid grid-cols-9 gap-2 px-2">
        <button
          v-for="n in 9"
          :key="n"
          @click="fillCell(n)"
          :class="[
            'aspect-square rounded-xl text-xl font-bold transition-all duration-200',
            'bg-cyber-blue/10 border border-cyber-blue/30',
            'hover:bg-cyber-blue/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]',
            'active:scale-95'
          ]"
        >
          {{ n }}
        </button>
      </div>

      <div v-if="gameStarted && !gameCompleted" class="w-full grid grid-cols-2 gap-4 px-2">
        <button @click="clearCell" class="cyber-button bg-cyber-red/10 border-cyber-red/30 hover:border-cyber-red">
          🗑 清除
        </button>
        <button @click="restart" class="cyber-button">
          🔄 重新开始
        </button>
      </div>

      <div v-if="gameCompleted" class="w-full grid grid-cols-2 gap-4 px-2">
        <button @click="newGame" class="cyber-button">
          🎮 新游戏
        </button>
        <button @click="restart" class="cyber-button bg-cyber-green/10 border-cyber-green/30 hover:border-cyber-green">
          🔄 再玩一次
        </button>
      </div>
    </div>

    <div v-if="showDifficultyModal" class="modal-overlay" @click.self="showDifficultyModal = false">
      <div class="modal-content text-center">
        <h2 class="text-2xl font-bold text-cyber-blue mb-2">选择难度</h2>
        <p class="text-cyber-blue/60 text-sm mb-6">挑战你的数独技巧</p>
        <div class="flex flex-col gap-3">
          <button
            v-for="diff in difficulties"
            :key="diff.value"
            @click="selectDifficulty(diff.value)"
            class="cyber-button"
          >
            {{ diff.label }} - 剩余 {{ diff.hint }} 格
          </button>
        </div>
      </div>
    </div>

    <div v-if="showWinModal" class="modal-overlay" @click.self="showWinModal = false">
      <div class="modal-content text-center">
        <div class="text-6xl mb-4 animate-celebrate">🎉</div>
        <h2 class="text-3xl font-bold text-cyber-green glow-text mb-2">恭喜完成!</h2>
        <p class="text-cyber-blue/80 mb-2">你用时</p>
        <p class="text-4xl font-mono text-cyber-blue mb-6">{{ formattedTime }}</p>
        <button @click="newGame" class="cyber-button active">
          🎮 再来一局
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
