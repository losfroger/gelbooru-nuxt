<template>
  <div>
    <QBtn
      label="Go to post ID"
      color="secondary"
    >
      <QMenu>
        <QCard>
          <QCardSection>
            <QInput
              v-model="postId"
              type="number"
              label="ID"
            />
            <QBtn label="Go" @click="goToPostId" />
          </QCardSection>
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