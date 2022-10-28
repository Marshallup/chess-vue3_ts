<template>
  <div class="home flex justify-center items-center min-h-screen pt-8 pb-8">
    <div v-if="gameOver">GAME OVER</div>
    <TheBoard :game="game as Game" @on-click-cell="onInitActiveCell" />
  </div>
</template>

<script lang="ts" setup>
import TheBoard from '@/components/TheBoard.vue';
import { Game } from '@/models/Game';
import { reactive, computed } from 'vue';

const game = reactive(new Game());
const gameOver = computed(() => game.isGameOver);

function onInitActiveCell(cellKey: string) {
  game.initActiveCell(cellKey);
}
</script>
