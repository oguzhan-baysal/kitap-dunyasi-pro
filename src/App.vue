<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { State } from './types/store';

const store = useStore<State>();

onMounted(async () => {
  // Initialize store modules
  await store.dispatch('currency/initialize');
  await store.dispatch('favorites/initialize');
  await store.dispatch('ui/initialize');
});
</script>

<template>
  <div id="app" :class="{ 'dark-theme': store.state.ui.theme === 'dark' }">
    <router-view />
  </div>
</template>

<style lang="scss">
@import './styles/variables';
@import './styles/reset';
@import './styles/themes';
@import './styles/typography';

#app {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &.dark-theme {
    --bg-primary: #{$dark-bg-primary};
    --bg-secondary: #{$dark-bg-secondary};
    --text-primary: #{$dark-text-primary};
    --text-secondary: #{$dark-text-secondary};
    --border-color: #{$dark-border-color};
  }
}
</style>
