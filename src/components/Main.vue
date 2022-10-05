<template>
  <section>
    <section class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">
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
      <ActivityCard v-if="data.length > 0" :data="data" @deleteData="deleteData" />
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
import { ACTIVITY } from "../store/enums";
import { useStore } from "vuex";
import DeleteDialog from "../components/dialogs/DeleteDialog.vue";
import ActivityCard from "../components/general/ActivityCard.vue";
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
  components: { DeleteDialog, ActivityCard },
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

    const onClose = (isRefresh: boolean) => {
      if (isRefresh) loadData()
      showDelete.value.value = false;
    };

    const deleteData = (data: any) => {
      showDelete.value = { id: data.id, title: data.title, value: true }
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
      deleteData,
      addNewActivity,
    };
  },
});
</script>