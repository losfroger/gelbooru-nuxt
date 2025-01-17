<template>
  <div>
    <QBtn
      v-bind="props.buttonProps"
      label="Go to post ID"
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
              >
                <template #prepend>
                  <QIcon name="mdi-key" />
                </template>
              </QInput>
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
import type { QBtnProps } from 'quasar'


interface GelbooruGoToPostIdProps {
  buttonProps: QBtnProps
}

const router = useRouter()
const postId = ref('')

const props = withDefaults(defineProps<GelbooruGoToPostIdProps>(), {
  buttonProps: (): QBtnProps => ({
    color: 'secondary',
  }),
})

function goToPostId() {
  if (!postId.value) {
    return
  }

  router.push(`/post/${postId.value}`)
}

</script>

<style scoped>

</style>