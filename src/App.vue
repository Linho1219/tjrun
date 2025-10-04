<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import Fuse, { type FuseResult } from 'fuse.js'
import WithHighlight from './components/WithHighlight.vue'
const input = ref('')
const maxresults = 10
// let indexed: FlattenedItem[] | null = null
let fuse: Fuse<FlattenedItem> | null = null
const results = computed(() => {
  if (!input.value || fuse === null) return []
  const results = fuse.search(input.value)
  if (results.length > maxresults) return results.slice(0, maxresults)
  return results
})

;(async () => {
  const data = await fetch('/indexed.json').then((res) => res.json())
  // console.log(data)
  // indexed = data
  fuse = new Fuse(data, {
    keys: ['name', 'alias', 'pathLabel'],
    includeScore: true,
    threshold: 0.3,
    includeMatches: true,
  })
})()

function getIndices(field: string, result: FuseResult<FlattenedItem>) {
  const match = result.matches?.find((m) => m.key === field)
  if (!match) return undefined
  return match.indices as [number, number][]
}

const selectedIndex = ref(-1)
function onKeydown(e: KeyboardEvent) {
  if (!results.value.length) return
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % results.value.length
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + results.value.length) % results.value.length
      break
    case 'Enter':
      e.preventDefault()
      const current = results.value[selectedIndex.value]
      if (current) window.open(current.item.url, '_blank', 'noopener,noreferrer')
      break
  }
}
function onBlur() {
  selectedIndex.value = -1
}
const resultRefs = useTemplateRef('resultRefs')
watch(selectedIndex, () => {
  if (selectedIndex.value < 0) return
  const el = resultRefs.value?.[selectedIndex.value] as HTMLElement | undefined
  if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
})
</script>

<template>
  <v-app id="vapp">
    <main>
      <div id="search-field">
        <v-text-field
          class="search-input"
          variant="outlined"
          placeholder="输入以搜索"
          v-model="input"
          hide-details="auto"
          clearable
          prepend-inner-icon="mdi-magnify"
          color="primary"
          @keydown="onKeydown"
          @blur="onBlur"
        ></v-text-field>
      </div>
      <ul id="result-list">
        <li
          v-for="(result, index) in results"
          :key="result.item.pathLabel + result.item.name"
          class="result-item"
          :class="{ 'is-selected': index === selectedIndex }"
          ref="resultRefs"
        >
          <a :href="result.item.url" target="_blank" rel="noopener noreferrer" class="result-link">
            <div class="result-item-container" v-ripple>
              <div class="result-path" v-if="result.item.path.length">
                <template v-for="path in result.item.path">
                  <span class="result-path-segment">{{ path.name }}</span>
                  <span class="result-path-separator">/</span>
                </template>
              </div>
              <div v-else class="result-tag">
                <span v-if="result.item.url.includes('tongji.edu.cn')" class="official">
                  官方网站
                </span>
                <span v-else-if="result.item.url.includes('tongji.icu')" class="oolong">
                  乌龙茶网站
                </span>
                <span v-else> 第三方网站 </span>
              </div>
              <div class="result-item-name">
                <WithHighlight :text="result.item.name" :indices="getIndices('name', result)" />
                <span
                  class="result-item-alias"
                  v-if="result.item.alias && getIndices('alias', result)"
                >
                  (<WithHighlight
                    :text="result.item.alias"
                    :indices="getIndices('alias', result)"
                  />)
                </span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </main>
  </v-app>
</template>

<style lang="scss">
main {
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
#search-field {
  padding: 1rem 0;
}
.search-input {
  font-size: 1.5rem;
  input {
    font-size: 1.2rem;
  }
}
#result-list {
  height: 0;
  flex: 1;
  overflow: auto;
  margin: 0 0 1rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.result-item {
  list-style: none;
  margin: 0;
  padding: 0;
}
.result-link {
  text-decoration: none;
  color: inherit;
  outline: none !important;
}
.result-item-container {
  padding: 12px 16px;
  height: 4.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.15rem;
  position: relative;
  border-radius: 0.3rem;
  background-color: rgb(var(--v-theme-surface));
  transition: background-color 0.1s ease-in-out;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  &:hover::after {
    opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier));
  }
  .result-link:focus-visible &,
  .result-item.is-selected & {
    background-color: rgba(var(--v-theme-primary), 0.3) !important;
  }
}
.result-path {
  font-size: 0.75rem;
  opacity: 0.75;
  .result-path-separator {
    margin: 0 0.3rem;
    opacity: 0.5;
  }
}
.result-tag {
  display: flex;
  span {
    font-size: 0.75rem;
    border: currentColor 1px solid;
    padding: 0 0.15rem;
    border-radius: 0.1rem;
    &.official {
      color: rgb(var(--v-theme-primary));
    }
    &.oolong {
      color: rgb(var(--v-theme-secondary));
    }
    color: rgb(var(--v-theme-on-surface), 0.5);
  }
}
.result-item-name {
  font-size: 1.1rem;
}
.result-item-alias {
  font-size: 0.8rem;
  opacity: 0.75;
}
.result-item-container mark {
  background-color: rgba(var(--v-theme-primary), 0.5) !important;
  color: rgb(var(--v-on-theme-primary)) !important;
  box-shadow: 0 0 0 0.1rem rgba(var(--v-theme-primary), 0.5);
  border-radius: 0.1rem;
}
</style>
