<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
  indices?: [number, number][]
}>()

const processedHTML = computed(() => {
  if (!props.indices || props.indices.length === 0) return props.text
  let result = ''
  let lastIndex = 0
  for (const [start, end] of props.indices) {
    result += escapeHtml(props.text.slice(lastIndex, start))
    result += `<mark>${escapeHtml(props.text.slice(start, end + 1))}</mark>`
    lastIndex = end + 1
  }
  result += escapeHtml(props.text.slice(lastIndex))
  return result
})

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
</script>

<template>
  <span v-html="processedHTML"></span>
</template>
