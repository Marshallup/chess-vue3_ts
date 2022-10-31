<template>
  <nav
    :class="`
    fixed w-full z-20 top-0 left-0 h-[40px]
    dark:bg-gray-700 py-2 px-4 text-[1.6rem] text-white
    flex justify-between gap-[50px]
  `"
  >
    <div>
      {{ PLAYER_SIDE_TITLE[FIGURE_SIDE.WHITE] }} - {{ whiteScore }},
      {{ PLAYER_SIDE_TITLE[FIGURE_SIDE.BLACK] }} - {{ blackScore }}
    </div>
    <div class="absolute left-1/2 top-[17px] -translate-x-1/2 -translate-y-1/2">
      ход - {{ PLAYER_SIDE_TITLE[playerSide] }}
    </div>
    <div>
      <TheButton size="sm" style-type="danger" @click="onSurrender"> Сдаться </TheButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { PLAYER_SIDE_TITLE } from '@/constants/game';
import { PlayerSide } from '@/models/Game';
import TheButton from '@/components/TheButton.vue';
import { FIGURE_SIDE } from '@/enums/figure';

interface TheHeaderProps {
  playerSide: PlayerSide;
  blackScore: number;
  whiteScore: number;
}
interface TheHeaderEmits {
  (e: 'onSurrender'): void;
}

defineProps<TheHeaderProps>();
const emit = defineEmits<TheHeaderEmits>();

function onSurrender() {
  emit('onSurrender');
}
</script>

<style scoped></style>
