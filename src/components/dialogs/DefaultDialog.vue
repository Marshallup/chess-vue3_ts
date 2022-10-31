<template>
  <Teleport to="body">
    <Transition>
      <div
        v-if="show"
        tabindex="-1"
        aria-hidden="true"
        :class="`
        bg-slate-700/[.30]
        flex
        items-center
        justify-center
        text-[1.6rem]
        overflow-y-auto
        overflow-x-hidden
        fixed
        top-0
        right-0
        left-0
        z-50
        w-full
        md:inset-0
        h-modal
        md:h-full`"
      >
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto m-auto">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- header -->
            <div
              v-if="title"
              class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600"
            >
              <h3 class="text-[2.2rem] font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <button
                v-if="showCrossIcon"
                type="button"
                :class="`text-gray-400
                  bg-transparent
                  hover:bg-gray-200 hover:text-gray-900 rounded-lg
                  text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600
                  dark:hover:text-white`"
                @click="closeDialog"
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- eslint-disable -->
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                  <!-- eslint-enable -->
                </svg>
                <span class="sr-only">Закрыть окно</span>
              </button>
            </div>
            <div class="p-6 space-y-6 leading-relaxed text-gray-400">
              <slot name="body" />
            </div>
            <!-- footer -->
            <div>
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface DefaultDialogProps {
  modelValue: boolean;
  title?: string;
  showCrossIcon?: boolean;
}
interface DefaultDialogEmits {
  (e: 'update:modelValue', val: DefaultDialogProps['modelValue']): void;
}

const props = withDefaults(defineProps<DefaultDialogProps>(), {
  showCrossIcon: true,
});
const emit = defineEmits<DefaultDialogEmits>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function closeDialog() {
  show.value = false;
}
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
