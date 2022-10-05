<template>
  <section>
    <el-dialog
      class="rounded-lg text-center"
      v-model="isVisible"
      width="30%"
      align-center
      :show-close="false"
      @close="closeModal"
    >
      <img class="mx-auto" src="/i-delete.svg" alt="icon-delete">
      <h3 class="text-xl">Apakah anda yakin menghapus item
        <br>
        <span class="font-bold">"{{ title }}"</span>?
      </h3>
      <template #footer>
        <div class="text-center">
          <button
            class="rounded-full py-2 px-7 bg-gray-300 font-bold text-md mx-2"
            type="button"
            @click="closeModal"
          >
            Batal
          </button>
          <button
            class="rounded-full py-2 px-7 bg-red-400 text-white font-bold text-md mx-2"
            type="button"
            @click="confirm"
          >
            Hapus
          </button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { TODO } from "../../store/enums";
import { toastSuccess } from "../../core/Helpers";

export default defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    }
  },
  setup(prop, context) {
    const store = useStore();
    const isVisible = computed(() => prop.modelValue)

    const closeModal = () => {
      context.emit("onClose", false);
    };

    const confirm = () => {
      store
        .dispatch(TODO.DELETE_DATA, prop.id)
        .then(() => {
          toastSuccess("Todo berhasil dihapus");
          context.emit("onClose", true);
        })
    };

    return {
      isVisible,
      confirm,
      closeModal,
    };
  },
});
</script>