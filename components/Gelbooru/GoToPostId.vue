<template>
  <div>
    <QBtn
      label="Go to post ID"
      color="secondary"
    >
      <QMenu
        transition-show="jump-down"
        transition-hide="jump-up"
        anchor="bottom middle"
        self="top middle"
      >
        <QCard>
          <QForm @submit="goToPostId">
            <QCardSection>
              <QInput
                v-model.number="postId"
                type="number"
                label="ID"
                filled
              />
            </QCardSection>
            <QCardActions>
              <QBtn
                label="Go"
                color="primary"
                type="submit"
                flat
              />
            </QCardActions>
          </QForm>
        </QCard>
      </QMenu>
    </QBtn>
  </div>
</template>

<script setup lang="ts">

const router = useRouter()
const postId = ref('')

function goToPostId() {
  if (!postId.value) {
    return
  }

  router.push(`/post/${postId.value}`)
}

</script>

<style scoped>

</style>