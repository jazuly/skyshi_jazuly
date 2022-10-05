<template>
  <section>
    <el-dialog
      class="rounded-lg"
      v-model="isVisible"
      width="30%"
      align-center
      :show-close="false"
      @close="closeModal"
      @open="resetData"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="flex justify-between items-center mb-4">
          <h4 :id="titleId" :class="titleClass" class="font-bold">Tambah List Item</h4>
          <button class="text-slate-500" @click="close">X</button>
        </div>
        <div class="divide-y"><div /><div /></div>
      </template>
      <section>
        <div class="mb-2">
          <label class="font-bold text-xs">NAMA LIST ITEM</label>
          <el-input class="w-full" v-model="form.title" autocomplete="off" />
        </div>
        <div class="mt-2">
          <label class="font-bold text-xs">PRIORITY</label>
          <el-select class="w-full" v-model="form.priority" placeholder="Please select a zone">
              <el-option
                v-for="(prio, pKey) in priorities"
                :key="pKey"
                :label="prio.label"
                :value="prio.value"
              >
              <div class="flex items-center">
                <div class="rounded-full w-2 h-2 mr-2" :class="priorityColor(prio.value)" />
                <span>{{ prio.label }}</span>
              </div>
              </el-option>
            </el-select>
        </div>
      </section>
      <template #footer>
        <div class="divide-y"><div /><div /></div>
        <div class="text-right mt-4">
          <button
            class="rounded-full py-2 px-7 text-white font-bold text-md"
            :class="isDisabled ? 'bg-blue-400' : 'bg-blue-500'"
            type="button"
            :disabled="isDisabled"
            @click="addTodo"
          >
            Confirm
          </button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { TODO } from "../../store/enums";
import { useRoute } from "vue-router";
import { priorityColor } from "../../core/Helpers";

interface Form {
  id: number,
  activity_group_id: number,
  priority: string,
  title: string,
}

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
    }
  },
  setup(prop, context) {
    const store = useStore();
    const route = useRoute();
    const form = ref<Form>({
      id: 0,
      activity_group_id: 0,
      priority: "",
      title: "",
    });
    const priorities = ref([
      { label: "Very High", value: "very-high" },
      { label: "High", value: "high" },
      { label: "Medium", value: "normal" },
      { label: "Low", value: "low" },
      { label: "Very Low", value: "very-low" },
    ])
    
    const isVisible = computed(() => prop.modelValue)
    const isDisabled = computed(() => {
      return (!form.value.title || !form.value.priority)
    })

    const resetData = () => {
      form.value = {
        id: prop.data?.id ?? 0,
        activity_group_id: 0,
        priority: prop.data?.priority ?? "",
        title: prop.data?.title ?? "",
      }
    }

    const closeModal = () => {
      context.emit("onClose", false);
    };

    const addTodo = () => {
      let apiPath = TODO.CREATE;
      if (form.value.id) {
        apiPath = TODO.UPDATE_DATA
      }
      
      store
        .dispatch(apiPath, { ...form.value, activity_group_id: route.params.id })
        .then(() => {
          context.emit("onClose", true);
        })
    };

    return {
      form,
      isVisible,
      isDisabled,
      priorities,
      addTodo,
      resetData,
      closeModal,
      priorityColor,
    };
  },
});
</script>

<style scoped>
::v-deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>