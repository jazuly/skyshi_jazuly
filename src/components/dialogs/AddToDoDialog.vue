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
          <el-input class="w-full" size="large" v-model="form.title" autocomplete="off" />
        </div>
        <div class="mt-2">
          <label class="font-bold text-xs">PRIORITY</label>
          <el-dropdown
            class="w-full"
            trigger="click"
            @command="handleCommand"
            @visible-change="handleVisible"
          >
            <button class="p-3 border rounded-md w-48 button-dropdown">
              <section class="flex justify-between items-center">
                <div class="flex items-center">
                  <div class="rounded-full w-2 h-2 mr-2" :class="priorityColor(form.priority)" />
                  <span>{{ getPrioLabel(form.priority) }}</span>
                </div>
                <img class="transition-all" :class="isActiveDropdown && 'rotate-img'" src="/i-bottom-arrow.svg" alt="icon-bottom">
              </section>
            </button>
            <template #dropdown>
              <el-dropdown-menu class="w-48">
                <el-dropdown-item
                  v-for="(prio, pKey) in priorities"
                  :key="pKey"
                  :command="prio.value"
                >
                  <section class="flex justify-between items-center w-full">
                    <div class="flex items-center">
                      <div class="rounded-full w-2 h-2 mr-2" :class="priorityColor(prio.value)" />
                      <span>{{ prio.label }}</span>
                    </div>
                    <img v-show="prio.value === form.priority" src="/i-checked.svg" alt="icon-checked">
                  </section>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    const isActiveDropdown = ref(false);
    const form = ref<Form>({
      id: 0,
      activity_group_id: 0,
      priority: "very-high",
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
        priority: prop.data?.priority ?? "very-high",
        title: prop.data?.title ?? "",
      }
    }

    const getPrioLabel = (value: string) => {
      const getPrio = priorities.value
        .find((d: any) => d.value === value);

      if (getPrio) {
        return getPrio.label
      }
    };

    const handleVisible = (isVisible: any) => {
      if (isVisible) {
        isActiveDropdown.value = true;
      } else {
        isActiveDropdown.value = false;
      }
    };

    const closeModal = () => {
      context.emit("onClose", false);
    };

    const handleCommand = (command: string) => {
      form.value.priority = command;
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
      getPrioLabel,
      isActiveDropdown,
      handleVisible,
      priorityColor,
      handleCommand,
    };
  },
});
</script>

<style scoped>
::v-deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 10px;
}
.rotate-img {
  rotate: 180deg;
}
</style>