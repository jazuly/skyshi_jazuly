<template>
  <section>
    <section class="flex justify-between items-center">
      <div class="flex items-center" :class="[isEditTitle && 'w-full']">
        <img
          class="my-auto mr-5 cursor-pointer"
          src="/i-left-arrow.svg"
          alt="icon-left-arrow"
          @click="router.push({ name: NAME.INDEX })"
        >
        <input
          v-if="isEditTitle"
          ref="input"
          class="p-2 mr-5 bg-transparent border-b focus-visible:outline-none border-black w-full font-bold text-3xl"
          type="text"
          v-model="form.title"
          @blur="(isEditTitle = false)"
        >
        <div v-else class="pr-5 font-bold text-3xl">{{ data?.title }}</div>
        <button class="mr-5" @click="isEditTitle = !isEditTitle"><img class="my-auto" src="/i-pencil.svg" alt="icon-pencil"></button>
      </div>
      <div>
        <button
          class="bg-[#16ABF8] py-2 px-5 text-white font-bold rounded-full flex"
          @click="(showAdd = true)"
        >
          <img class="pr-2" src="/i-plus.svg" alt="icon-plus">
          Tambah
        </button>
      </div>
    </section>
    <section class="py-10">
      <ToDoCard
        v-if="data.todo_items.length > 0"
        :data="data.todo_items"
        @refreshData="loadData"
        @deleteData="deleteData"
      />
      <img v-else class="mx-auto" src="/todo-empty-state.svg" alt="empty-data">
    </section>
    <AddToDoDialog v-model="showAdd" @onClose="onClose" />

    <DeleteToDoDialog
      v-model="showDelete.value"
      :title="showDelete.title"
      :id="showDelete.id"
      @onClose="onClose"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { ACTIVITY } from "../store/enums";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import AddToDoDialog from "../components/dialogs/AddToDoDialog.vue";
import DeleteToDoDialog from "../components/dialogs/DeleteTodoDialog.vue";
import ToDoCard from "../components/general/ToDoCard.vue";
import { useRouter } from 'vue-router';
import { NAME } from "../routers/enums"

interface Form {
  id: number,
  title: string | null,
}

interface ToDo {
  id: number,
  title: string,
  is_active: number,
  priority: string
}

interface Data {
  id: number,
  title: string,
  todo_items: ToDo[]
}

interface deleteDialog {
  value: boolean,
  title: string,
  id: number,
}

export default defineComponent({
  components: { AddToDoDialog, ToDoCard, DeleteToDoDialog },
  setup() {
    const router = useRouter();
    const store = useStore();
    const route = useRoute();
    const isEditTitle = ref(false);
    const input = ref();
    const showAdd = ref(false);
    const form = ref<Form>({ id: 0, title: null });
    const showDelete = ref<deleteDialog>({
      value: false,
      title: "",
      id: 0,
    });
    const data = ref<Data>({
      id: 0,
      title: "",
      todo_items: []
    });

    onMounted(() => loadData());

    watch(
      () => isEditTitle.value,
      () => {
        if (isEditTitle.value) {
          setTimeout(() => input.value.focus(), 200)
        } else if(!isEditTitle.value && form.value.title !== data.value.title) {
          updateTitle()
        }
      }
    )

    const onClose = (isRefresh: boolean) => {
      if (isRefresh) loadData()
      showAdd.value = false;
      showDelete.value.value = false;
    };

    const deleteData = (data: any) => {
      console.log(data)
      showDelete.value = { id: data.id, title: data.title, value: true }
    };

    const updateTitle = () => {
      store
        .dispatch(ACTIVITY.UPDATE_DATA, { ...form.value, id: route.params.id })
        .then((res) => {
          data.value.title = res.title
        })
    };

    const loadData = () => {
      store
        .dispatch(ACTIVITY.GET_ONE, route.params.id)
        .then((res) => {
          if (res) {
            form.value.title = res.title;
            data.value = {
              id: res.id,
              title: res.title,
              todo_items: res.todo_items.map((dt: any) => {
                return {
                  id: dt.id,
                  title: dt.title,
                  is_active: dt.is_active,
                  priority: dt.priority,
                }
              })
            }
          }
        })
    };

    return {
      NAME,
      form,
      data,
      input,
      router,
      showAdd,
      showDelete,
      isEditTitle,
      onClose,
      loadData,
      deleteData,
      updateTitle,
    };
  },
});
</script>