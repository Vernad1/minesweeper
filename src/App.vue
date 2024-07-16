<script setup lang="ts">
import Square from './components/Square.vue'
import Popup from './components/Popup.vue'
import { useGame } from './hooks/useGame'

const { board, openSquare, flagSquare, gameStatus, restart } = useGame(8, 8, 10)
</script>

<template>
  <h1>Сапер</h1>
  <div class="game-container">
    <div class="row" v-for="row in board">
      <Square
        @open="openSquare"
        @flag="flagSquare"
        :square="square"
        v-for="square in row"
        :key="square.id"
      ></Square>
    </div>
  </div>
  <Popup :game-status="gameStatus" @restart="restart"></Popup>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 320px;
}

.row {
  display: flex;
}
</style>
