<script setup lang="ts">
import UserInfo from '@/components/profile/UserInfo.vue'
import UserBooks from '@/components/profile/UserBooks.vue'
import UserFavorites from '@/components/profile/UserFavorites.vue'
import UserComments from '@/components/profile/UserComments.vue'
</script>

<template>
  <div class="profile-view">
    <aside class="profile-sidebar">
      <UserInfo />
    </aside>
    <main class="profile-content">
      <UserBooks />
      <UserFavorites />
      <UserComments />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  padding: 2rem;
  display: grid;
  gap: 2rem;
  grid-template-columns: 300px 1fr;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.profile-sidebar {
  background: var(--color-card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style> 