<template>
  <div class="pt-16 pb-8">
    <TheHeader
      :player-side="game.playerSide"
      :black-score="blackScore"
      :white-score="whiteScore"
      @on-surrender="onSurrender"
    />

    <DefaultDialog
      v-model="dialogGameOver"
      :title="`Игра окончена. ${
        currentWinner !== null && currentWinner >= 0
          ? PLAYER_SIDE_TITLE[currentWinner]
          : 'Сторона не определена :('
      } победили.`"
      :show-cross-icon="false"
    >
      <template #body> Начать заного ? </template>
      <template #footer>
        <div
          :class="`
            flex items-center justify-end p-6 space-x-2 rounded-b border-t
            border-gray-200 dark:border-gray-600`"
        >
          <TheButton @click="onResetGame">ОК</TheButton>
        </div>
      </template>
    </DefaultDialog>
    <DefaultDialog v-model="dialogSurrender" title="Сдаться ?">
      <template #body>{{ PLAYER_SIDE_TITLE[game.getEnemySide] }} выйграют.</template>
      <template #footer>
        <div
          :class="`
            flex items-center justify-end p-6 space-x-2 rounded-b border-t
            border-gray-200 dark:border-gray-600`"
        >
          <TheButton style-type="danger" @click="onSurrend">Сдаться</TheButton>
        </div>
      </template>
    </DefaultDialog>
    <div class="home flex-col justify-center items-center min-h-screen overflow-auto sm:flex">
      <TheBoard :game="game as Game" class="m-auto" @on-click-cell="onInitActiveCell" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, watch } from 'vue';
import { Game } from '@/models/Game';
import { FIGURE_SIDE } from '@/enums/figure';
import { PLAYER_SIDE_TITLE } from '@/constants/game';
import TheBoard from '@/components/TheBoard.vue';
import DefaultDialog from '@/components/dialogs/DefaultDialog.vue';
import TheButton from '@/components/TheButton.vue';
import TheHeader from '@/components/TheHeader.vue';

const game = reactive(new Game());
const gameOver = computed(() => game.isGameOver);
const dialogGameOver = ref(false);
const dialogSurrender = ref(false);
const blackScore = computed(() => game.winnerScore[FIGURE_SIDE.BLACK]);
const whiteScore = computed(() => game.winnerScore[FIGURE_SIDE.WHITE]);
const currentWinner = computed(() => game.currentWinner);

function onResetGame() {
  game.resetGame();
  dialogGameOver.value = false;
  dialogSurrender.value = false;
}
function onSurrend() {
  game.setMate(game.playerSide, true);
  dialogGameOver.value = false;
  dialogSurrender.value = false;
}
function onSurrender() {
  dialogSurrender.value = true;
}
function onInitActiveCell(cellKey: string) {
  game.initActiveCell(cellKey);
}

watch(gameOver, (gameOverValue) => {
  if (gameOverValue) {
    dialogGameOver.value = true;
  }
});
</script>
