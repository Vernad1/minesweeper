<script setup lang="ts">
import type { ISquare } from '@/types/Square'

interface Props {
  square: ISquare
}

defineProps<Props>()

function cardClick(row: number, col: number) {
  emit('open', row, col)
}

function rightClick(row: number, col: number) {
  emit('flag', row, col)
}

const emit = defineEmits<{
  (e: 'open', row: number, col: number): void
  (e: 'flag', row: number, col: number): void
}>()
</script>

<template>
  <div
    @contextmenu.prevent="rightClick(square.row, square.col)"
    @click="cardClick(square.row, square.col)"
    class="square"
    :class="{ close: !square.isOpen, bomb: square.isBomb && square.isOpen }"
  >
    {{
      square.isOpen && square.isBomb
        ? '💣'
        : square.isOpen
          ? square.value
          : square.isFlagged
            ? '🚩'
            : ' '
    }}
  </div>
</template>

<style>
.square {
  border: 1px solid #272727;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.square.close {
  background-color: #b9b9b9;
}

.square.bomb {
  background-color: #ff0000;
}
</style>
