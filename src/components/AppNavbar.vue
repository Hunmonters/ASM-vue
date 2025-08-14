<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Auth } from '../services/auth'

const user = ref(Auth.get())

function onAuthChanged(e) {
  user.value = e.detail // user hoặc null
}

onMounted(() => window.addEventListener('auth:changed', onAuthChanged))
onBeforeUnmount(() => window.removeEventListener('auth:changed', onAuthChanged))
</script>
