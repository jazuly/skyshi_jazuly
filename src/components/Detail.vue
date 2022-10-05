<template>
  <section>
    <div class="flex justify-between items-center">
      <div class="flex items-center" :class="[isEditTitle && 'w-full']">
        <img class="my-auto mr-5" src="/i-left-arrow.svg" alt="icon-left-arrow">
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
        >
          <img class="pr-2" src="/i-plus.svg" alt="icon-plus">
          Tambah
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { ACTIVITY } from "../store/enums";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

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

export default defineComponent({
  setup() {
    const data = ref<Data>();
    const store = useStore();
    const route = useRoute();
    const form = ref<Form>({ id: 0, title: null });
    const isEditTitle = ref(false);
    const input = ref();

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
      form,
      data,
      isEditTitle,
      updateTitle,
      input,
    };
  },
});
</script>