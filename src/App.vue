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
  if (results.length > maxresults) results.length = maxresults
  const adjustedResults = results.map((r) => {
    const depth = r.item.path.length
    const depthPenalty = depth ** 2 * 0.1
    return { ...r, ascore: r.score! + depthPenalty }
  })
  adjustedResults.sort((a, b) => a.ascore - b.ascore)
  return adjustedResults
})

;(async () => {
  const data = await fetch('/indexed.json').then((res) => res.json())
  // console.log(data)
  // indexed = data
  fuse = new Fuse(data, {
    keys: ['name', 'alias', { name: 'pathLabel', weight: 0.05 }],
    includeScore: true,
    threshold: 0.6,
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
      <div id="logo" :class="{ hidden: input }"><span class="accent">TJ</span>Run</div>
      <div id="search-field">
        <v-text-field
          class="search-input"
          variant="outlined"
          placeholder="键入以开始搜索"
          v-model="input"
          hide-details="auto"
          clearable
          prepend-inner-icon="mdi-magnify"
          color="primary"
          @keydown="onKeydown"
          @blur="onBlur"
        ></v-text-field>
      </div>
      <ul id="result-list" :class="{ folded: !input }">
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
      <div id="about">
        <a href="https://github.com/Linho1219/tjrun" target="_blank" rel="noopener noreferrer">
          <v-btn variant="text" size="small"> Github </v-btn>
        </a>
        <a href="https://linho.cc/" target="_blank" rel="noopener noreferrer">
          <v-btn variant="text" size="small"> About Me </v-btn>
        </a>
      </div>
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
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  user-select: none;
}
#logo {
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  transition: opacity 0.8s;
  height: 4.5rem;
  margin-top: -4.5rem;
  .accent {
    color: rgb(var(--v-theme-primary));
  }
  &.hidden {
    height: 0;
    margin-top: 0;
    opacity: 0;
    transition: none;
  }
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
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: flex 0.2s;
  &.folded {
    flex: 0;
  }
}
.result-item {
  list-style: none;
  margin: 0;
  padding: 0;
}
a {
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
  border: 1px solid;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
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
  background-color: rgba(var(--v-theme-primary), 0.8) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  box-shadow: 0 0 0 0.1rem rgba(var(--v-theme-primary), 0.8);
  border-radius: 0.1rem;
}
#about {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0.5rem 0;
}
</style>
