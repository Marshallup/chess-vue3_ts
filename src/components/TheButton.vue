<template>
  <button
    type="button"
    :class="`
      focus:outline-none
      font-medium
      rounded-lg
      text-center
      focus:ring-4
      transition-colors
      ${sizeClass}
      ${styleClasses}`"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface BaseButtonProps {
  styleType?: 'default' | 'cancel' | 'danger';
  size?: 'md' | 'sm';
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  styleType: 'default',
  size: 'md',
});

const styleClasses = computed(() => {
  switch (props.styleType) {
    case 'cancel':
      return 'focus:ring-blue-300 text-gray-500 bg-white hover:bg-gray-100 border-gray-200 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600';
    case 'danger':
      return 'focus:ring-red-600 text-white bg-red-700 hover:bg-red-600';
    default:
      return 'focus:ring-blue-300 text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
  }
});
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-4 py-1.5 text-[1.4rem]';
    default:
      return 'px-5 py-2.5 text-[1.6rem]';
  }
});
</script>

<style scoped></style>
