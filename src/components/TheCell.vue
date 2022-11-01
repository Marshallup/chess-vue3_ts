<template>
  <div
    class="items-center select-none lg:w-cell-size lg:h-cell-size"
    :class="{
      'relative w-[40px] h-[40px] flex justify-center': true,
      'bg-active-cell': isActive,
      [cellTypeClass]: !isActive,
      'cursor-pointer': isActive || isCanCut || isCanMove || isCanAction,
    }"
  >
    <div
      class="absolute rounded-full bg-transparent"
      :class="{
        'md:w-8 md:h-8 w-6 h-6 bg-black/20': isCanMove,
        'w-[90%] h-[90%] border-4 border-black/20': isCanCut,
      }"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface TheCellProps {
  isActiveSide: boolean;
  isEven: boolean;
  isActive: boolean;
  isCanMove: boolean;
  isCanCut: boolean;
  isCanAction: boolean;
}

const props = withDefaults(defineProps<TheCellProps>(), {
  isActiveSide: false,
});
const cellTypeClass = computed(() => {
  if (props.isEven) {
    return 'bg-event-color';
  }

  return 'bg-odd-color';
});
</script>
