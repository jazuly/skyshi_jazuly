<template>
  <section class="flex flex-col justify-evenly">
    <div
      v-for="(d, dKey) in data"
      :key="dKey"
      class="bg-white p-5 rounded-lg shadow-md my-1 flex justify-between items-center"
    >
      <div class="flex items-center">
        <el-checkbox class="pr-3" />
        <div class="rounded-full w-3 h-3 mr-3" :class="priorityColor(d.priority)" />
        <h3 class="font-bold text-xl mr-3">{{ d.title }}</h3>
        <button><img class="my-auto" src="/i-pencil.svg" alt="icon-pencil"></button>
      </div>
      <div class="flex justify-between items-center">
        <button
          @click="$emit('deleteData', d)"
        >
          <img src="/i-trash.svg" alt="icon-trash">
        </button>
      </div>
    </div>
    <AddToDoDialog v-model="showAdd" :data="d" @onClose="onClose" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { priorityColor } from "../../core/Helpers";

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    }
  },

  setup(_, context) {
    const showAdd = ref(false);

    const onClose = (isRefresh: boolean) => {
      if (isRefresh) context.emit('refreshData')
      showAdd.value = false;
    };

    return {
      showAdd,
      onClose,
      priorityColor,
    };
  },
})
</script>
