<template>
  <section class="flex flex-col justify-evenly">
    <div
      v-for="(d, dKey) in data"
      :key="dKey"
      class="bg-white p-5 rounded-lg shadow-md my-1 flex justify-between items-center"
    >
      <div class="flex items-center">
        <input
          type="checkbox"
          class="mr-3 w-5 h-5"
          :value="d.id"
          :checked="!d.is_active"
          @change="updateStatus($event)"
        />
        <div class="rounded-full w-3 h-3 mr-3" :class="priorityColor(d.priority)" />
        <h3 class="font-bold text-xl mr-3" :class="[!d.is_active && 'line-through text-slate-400']">{{ d.title }}</h3>
        <button @click="(dEdit = d, showAdd = true)">
          <img class="my-auto" src="/i-pencil.svg" alt="icon-pencil">
        </button>
      </div>
      <div class="flex justify-between items-center">
        <button
          @click="$emit('deleteData', d)"
        >
          <img src="/i-trash.svg" alt="icon-trash">
        </button>
      </div>
    </div>
    <AddToDoDialog v-model="showAdd" :data="dEdit" @onClose="onClose" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { priorityColor } from "../../core/Helpers";
import { useStore } from "vuex";
import { TODO } from "../../store/enums";
import AddToDoDialog from "../dialogs/AddToDoDialog.vue";

interface ToDo {
  id: number,
  title: string,
  is_active: number,
  priority: string
}

export default defineComponent({
  components: { AddToDoDialog },
  props: ['data'],

  setup(_, context) {
    const showAdd = ref(false);
    const store = useStore();
    const dEdit = ref<ToDo>();

    const onClose = (isRefresh: boolean) => {
      if (isRefresh) context.emit('refreshData')
      showAdd.value = false;
    };

    const updateStatus = ($e: any) => {
      const target = $e.target;
      const is_active = target.checked ? 0 : 1;

      store
        .dispatch(TODO.UPDATE_DATA, { id: target.value, is_active })
        .then(() => {
          context.emit("refreshData");
        })
    };

    return {
      dEdit,
      showAdd,
      onClose,
      updateStatus,
      priorityColor,
    };
  },
})
</script>
