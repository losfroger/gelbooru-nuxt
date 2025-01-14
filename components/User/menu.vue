<template>
  <div v-auto-animate class="tw-flex tw-flex-row tw-items-center">
    <QBtn
      v-if="authStore.logged_in_computed"
      icon="mdi-account-badge-outline"
      round
      flat
    >
      <QMenu anchor="bottom right" self="top right">
        <QList
          dense
          style="min-width: 150px"
          padding
        >
          <QItem>
            <QItemSection>
              <QItemLabel>User ID</QItemLabel>
              <QItemLabel caption>
                {{ authStore.user_id }}
              </QItemLabel>
            </QItemSection>
          </QItem>

          <QSeparator spaced />

          <QItem
            v-close-popup
            clickable
            :href="`https://gelbooru.com/index.php?page=account&s=profile&id=${authStore.user_id}`"
            target="_blank"
          >
            <QItemSection>Profile</QItemSection>
            <QItemSection avatar>
              <QIcon name="mdi-badge-account-horizontal-outline" />
            </QItemSection>
          </QItem>
          <QItem
            v-close-popup
            clickable
            href="https://gelbooru.com/index.php?page=gmail&s=home"
            target="_blank"
          >
            <QItemSection>Mail</QItemSection>
            <QItemSection avatar>
              <QIcon name="mdi-email-outline" />
            </QItemSection>
          </QItem>

          <QSeparator spaced />

          <QItem
            v-close-popup
            clickable
            @click="authStore.logout"
          >
            <QItemSection>Logout</QItemSection>
            <QItemSection avatar>
              <QIcon name="mdi-logout" />
            </QItemSection>
          </QItem>
        </QList>
      </QMenu>
    </QBtn>
    <QBtn
      v-else
      label="Login"
      icon="mdi-login"
      color="accent"
      outline
      to="/login"
    />
  </div>
</template>

<script setup lang="ts">

const authStore = useAuthStore()

</script>

<style scoped>

</style>