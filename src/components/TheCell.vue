<template>
  <div
    :class="`
    ${cellTypeClass}
    relative w-[40px] h-[40px]
    flex justify-center
    items-center select-none lg:w-cell-size lg:h-cell-size
    `"
  >
    <div
      class="absolute w-full h-full border-4"
      :class="{
        'border-red-500': isActive,
        'border-transparent': !isActive,
        'border-green-500': isCanMove,
        'border-black': isCanCut,
        'cursor-pointer': isActive || isCanCut || isCanMove || isCanAction,
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
