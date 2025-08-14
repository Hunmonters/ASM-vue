<template>
  <div class="container py-4" v-if="page">
    <h2 class="mb-2">{{ page.title }}</h2>
    <small class="text-muted d-block mb-3">
      Cập nhật: {{ new Date(page.updatedAt).toLocaleString() }}
    </small>
    <!-- Nếu bạn tin cậy nội dung do admin nhập, dùng v-html để render HTML -->
    <div v-html="page.content"></div>
    <!-- Nếu muốn thuần văn bản: <pre class="text-wrap">{{ page.content }}</pre> -->
  </div>

  <div v-else class="container py-5">
    <h5 class="text-muted">Trang không tồn tại.</h5>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { DB } from '../services/localData' // hoặc LocalAPI nếu bạn dùng lớp này

const route = useRoute()
const page = ref(null)

function load() {
  const slug = String(route.params.slug || '')
  page.value = DB.getPage(slug) // trả về null nếu không có
  if (page.value?.title) document.title = page.value.title + ' - App'
}

onMounted(load)
watch(() => route.params.slug, load)
</script>
