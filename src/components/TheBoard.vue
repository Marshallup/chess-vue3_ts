<template>
  <div class="w-board-size flex items-center flex-wrap">
    <TheCell
      v-for="(cell, cellKey, cellIdx) in game.Board.data"
      :key="cellKey"
      :is-even="isFillCell(cellIdx)"
      :is-active-side="cell.figure.side === game.playerSide"
      :is-active="cell.active"
      :is-can-action="game.isAvailableActionCellKey(cellKey as string)"
      :is-can-move="cell.canMove"
      :is-can-cut="cell.canCut"
      @click="onClickCell(cellKey as string)"
    >
      <FigureWrap
        v-if="cell.figure.type !== FIGURE_TYPE.CELL"
        :class="{
          'text-white': cell.figure.side === FIGURE_SIDE.WHITE,
          'text-black': cell.figure.side === FIGURE_SIDE.BLACK,
        }"
      >
        <TheBishop v-if="cell.figure.type === FIGURE_TYPE.BISHOP" />
        <ThePawn v-else-if="cell.figure.type === FIGURE_TYPE.PAWN" />
        <TheRook v-else-if="cell.figure.type === FIGURE_TYPE.ROOK" />
        <TheKnight v-else-if="cell.figure.type === FIGURE_TYPE.KNIGHT" />
        <TheQueen v-else-if="cell.figure.type === FIGURE_TYPE.QUEEN" />
        <TheKing v-else-if="cell.figure.type === FIGURE_TYPE.KING" />
      </FigureWrap>
    </TheCell>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { FIGURE_TYPE, FIGURE_SIDE } from '@/enums/figure';
import { Game } from '@/models/Game';
import { isFillCell } from '@/utils/helpers';
import TheCell from '@/components/TheCell.vue';
import TheBishop from '@/components/ChessIcons/TheBishop.vue';
import ThePawn from '@/components/ChessIcons/ThePawn.vue';
import TheRook from '@/components/ChessIcons/TheRook.vue';
import TheKnight from '@/components/ChessIcons/TheKnight.vue';
import TheQueen from '@/components/ChessIcons/TheQueen.vue';
import TheKing from '@/components/ChessIcons/TheKing.vue';
import FigureWrap from './FigureWrap.vue';

const game = reactive(new Game());

const onClickCell = (cellKey: string) => {
  game.initActiveCell(cellKey);
  console.log(cellKey, 'BoardCell clicked');
};

console.log(game.Board.data, 'board data');
</script>

<style scoped></style>
