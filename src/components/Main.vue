<template>
  <section class="h-[90vh] px-28 py-16 bg-[#E5E5E5]">
    <section class="flex justify-between items-center">
      <h1 class="text-3xl font-bold underline">
        Activity
      </h1>
      <button
        class="bg-[#16ABF8] py-2 px-5 text-white font-bold rounded-full flex"
        @click="addNewActivity"
      >
        <img class="pr-2" src="/i-plus.svg" alt="icon-plus">
        Tambah
      </button>
    </section>
    <section class="py-10">
      <div v-if="data.length > 0" class="grid grid-cols-4 gap-4">
        <div
          v-for="(d, dKey) in data"
          :key="dKey"
          class="flex flex-col justify-between h-[234px] my-3 bg-white p-5 rounded-lg shadow-md cursor-pointer"
        >
          <div>
            <h3 class="font-bold text-xl">{{ d.title }}</h3>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400">{{ dateFormat(d.created_at) }}</span>
            <button
              @click="(showDelete = { id: d.id, title: d.title, value: true })"
            >
              <img src="/i-trash.svg" alt="icon-trash">
            </button>
          </div>
        </div>
      </div>
      <img v-else class="mx-auto" src="/activity-empty-state.svg" alt="empty-data">
    </section>

    <DeleteDialog
      v-model="showDelete.value"
      :title="showDelete.title"
      :id="showDelete.id"
      @onClose="onClose"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import moment from "moment";
import { ACTIVITY } from "../store/enums";
import { useStore } from "vuex";
import DeleteDialog from "../components/dialogs/DeleteDialog.vue";
import { sortDate } from "../core/Helpers"
import _ from "lodash";

interface Activity {
  id: number,
  title: string,
  created_at: Date,
}

interface deleteDialog {
  value: boolean,
  title: string,
  id: number,
}

export default defineComponent({
  components: { DeleteDialog },
  setup() {
    const data = ref<Activity[]>([]);
    const store = useStore();
    const showDelete = ref<deleteDialog>({
      value: false,
      title: "",
      id: 0,
    });

    onMounted(() => loadData());

    watch(
      () => _.cloneDeep(data.value),
      () => {
        sortDate(data.value, "created_at", "asc")
      }
    );

    const dateFormat = (date: any) => moment(date).format("DD MMMM YYYY");

    const onClose = (isRefresh: boolean) => {
      if (isRefresh) loadData()
      showDelete.value.value = false;
    };

    const loadData = () => {
      store
        .dispatch(ACTIVITY.GET_ALL)
        .then((res) => {
          data.value = res.data;
        })
    };

    const addNewActivity = () => {
      store
        .dispatch(ACTIVITY.CREATE)
        .then((res) => {
          data.value.push({ id: res.id, title: res.title, created_at: res.created_at });
        })
    };

    return {
      data,
      showDelete,
      onClose,
      dateFormat,
      addNewActivity,
    };
  },
});
</script>