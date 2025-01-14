<template>
  <div class="tw-flex tw-h-[80dvh] tw-flex-col tw-items-center tw-justify-center">
    <QCard flat>
      <QForm @submit="onSubmitLogin">
        <QCardSection class="tw-flex tw-flex-col tw-gap-2">
          <h1 class="text-h5">
            Login
          </h1>
        </QCardSection>
        <QSeparator />
        <QCardSection class="tw-flex tw-flex-col tw-gap-2">
          <QInput
            v-model="loginForm.user_id"
            label="User id"
            filled
            :disable="loadingForm"
            :rules="[v => !!v || 'Please enter a user id']"
          >
            <template #prepend>
              <QIcon name="mdi-account-outline" />
            </template>
          </QInput>
          <QInput
            v-model="loginForm.api_key"
            label="Api key"
            type="password"
            filled
            :disable="loadingForm"
            :rules="[v => !!v || 'Please enter an api key']"
          >
            <template #prepend>
              <QIcon name="mdi-lock-outline" />
            </template>
          </QInput>
          <div class="tw-mt-4" />
          <p>
            Your credentials won't get stored anywhere inside the server.
          </p>
          <p>
            To access the Gelbooru API we need your access credentials. You can see your credentials in <a href="https://gelbooru.com/index.php?page=account&s=options">here</a>
          </p>
          <p>
            (You can paste your API credentials inside the textbox)
          </p>
        </QCardSection>
        <QCardSection class="tw-flex tw-flex-col">
          <QBtn
            :loading="loadingForm"
            label="Access"
            color="primary"
            type="submit"
            class="tw-ml-auto"
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