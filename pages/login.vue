<template>
  <div>
    <QCard flat>
      <QForm @submit="onSubmitLogin">
        <QCardSection class="tw-flex tw-flex-col tw-gap-2">
          <QInput
            v-model="loginForm.user_id"
            label="User id"
            :disable="loadingForm"
          />
          <QInput
            v-model="loginForm.api_key"
            label="Api key"
            :disable="loadingForm"
          />
        </QCardSection>
        <QCardSection>
          <QBtn
            :loading="loadingForm"
            label="Login"
            color="primary"
            type="submit"
          />
        </QCardSection>
      </QForm>
    </QCard>
  </div>
</template>

<script setup lang="ts">

const router = useRouter()

const authStore = useAuthStore()

const loadingForm = ref(false)
const loginForm = ref({
  user_id: '',
  api_key: '',
})

async function onSubmitLogin() {

  loadingForm.value = true

  authStore.login(loginForm.value.api_key, loginForm.value.user_id)
  .then(async () => {
    await new Promise(r => setTimeout(r, 1500))
    router.push('/')
  })
  .catch((err) => {
    console.log('Error', err)
    loadingForm.value = false
  })
}

</script>

<style scoped>

</style>