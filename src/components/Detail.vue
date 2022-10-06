<template>
  <section>
    <section class="flex justify-between items-center">
      <div class="flex items-center" :class="[isEditTitle && 'w-10/12']">
        <img
          class="my-auto mr-5 cursor-pointer"
          src="/i-left-arrow.svg"
          alt="icon-left-arrow"
          @click="router.push({ name: NAME.INDEX })"
        >
        <input
          v-if="isEditTitle"
          ref="input"
          class="p-2 bg-transparent border-b focus-visible:outline-none border-black w-full font-bold text-3xl"
          type="text"
          v-model="form.title"
          @blur="(isEditTitle = false)"
        >
        <div v-else class="pr-5 font-bold text-3xl">{{ data?.title }}</div>
        <button class="mr-5" @click="isEditTitle = !isEditTitle">
          <img class="my-auto" src="/i-pencil.svg" alt="icon-pencil">
        </button>
      </div>
      <div class="flex items-center">
        <el-dropdown
          trigger="click"
          @command="handleCommand"
        >
          <button
            class="p-2 text-white font-bold rounded-full flex border border-slate-400 mr-2"
          >
            <img src="/i-sorting.svg" alt="icon-sorting">
          </button>
          <template #dropdown>
            <el-dropdown-menu class="w-48">
              <el-dropdown-item
                v-for="(sort, pKey) in sortings"
                :key="pKey"
                :command="sort"
              >
                <section class="flex justify-between items-center w-full">
                  <div class="flex items-center">
                    <img :src="`/${sort.icon}`" :alt="`icon-${sort.label}`" class="mr-3">
                    <span>{{ sort.label }}</span>
                  </div>
                  <img v-show="sort.label === selectedSort.label" src="/i-checked.svg" alt="icon-checked">
                </section>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
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
import { sortString } from "../core/Helpers"
import _ from "lodash";

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
    const selectedSort = ref({ icon: "i-sort-new.svg", label: "Terbaru", column: "id", type: "asc" })
    const sortings = ref([
      { icon: "i-sort-new.svg", label: "Terbaru", column: "id", type: "asc" },
      { icon: "i-sort-old.svg", label: "Terlama", column: "id", type: "desc" },
      { icon: "i-sort-a.svg", label: "A-Z", column: "title", type: "desc" },
      { icon: "i-sort-z.svg", label: "Z-A", column: "title", type: "asc" },
      { icon: "i-sorting-blue.svg", label: "Belum Selesai", column: "is_active", type: "asc" },
    ])
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
      () => _.cloneDeep(data.value.todo_items),
      () => {
        sortString(data.value.todo_items, selectedSort.value.column, selectedSort.value.type)
      }
    );

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

    const handleCommand = (sortData: any) => {
      selectedSort.value = sortData;
      sortString(data.value.todo_items, sortData.column.toString(), sortData.type)
    };

    const deleteData = (data: any) => {
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
            data.value = res
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
      sortings,
      showDelete,
      isEditTitle,
      selectedSort,
      onClose,
      loadData,
      deleteData,
      updateTitle,
      handleCommand,
    };
  },
});
</script>