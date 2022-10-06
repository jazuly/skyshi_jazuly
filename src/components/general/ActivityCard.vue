<template>
  <section class="grid grid-cols-4 gap-4">
    <div
      v-for="(d, dKey) in data"
      :key="dKey"
      class="flex flex-col justify-between h-[234px] my-3 bg-white p-5 rounded-lg shadow-md cursor-pointer"
      @click="router.push({ name: NAME.DETAIL, params: { id: d.id } })"
    >
      <div>
        <h3 class="font-bold text-xl">{{ d.title }}</h3>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-400">{{ dateFormat(d.created_at) }}</span>
        <button
          @click="$emit('deleteData', d)"
        >
          <img src="/i-trash.svg" alt="icon-trash">
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import moment from "moment";
import { useRouter } from 'vue-router';
import { NAME } from "../../routers/enums"

export default defineComponent({
  props: ['data'],

  setup() {
    const router = useRouter();
    const dateFormat = (date: any) => moment(date).format("DD MMMM YYYY");

    return {
      dateFormat,
      router,
      NAME
    };
  },
})
</script>
