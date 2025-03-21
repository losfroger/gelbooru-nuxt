<template>
  <div class="tw-flex tw-h-[80dvh] tw-flex-col tw-items-center tw-justify-center">
    <QCard flat>
      <QForm @submit="onSubmitLogin" @paste.prevent="onPasteLogin">
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
            To access the Gelbooru API it's necessary to have your API access credentials. You can see your credentials in <a href="https://gelbooru.com/index.php?page=account&s=options">here</a>
          </p>
          <p>
            (You can paste your API credentials inside the textbox and it'll fill out the user ID and api key automatically)
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


definePageMeta({
  middleware: 'redirect-login-middleware',
})

useHead({
  title: 'Login',
})

const quasar = useQuasar()
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

// To check if it's a valid api key
const testRegApiAccessCreds = /^&api_key=.*&user_id=\d*$/
// To extract the api key
const apiKeyReg = /(?<=^&api_key=)(.*)(?=&user_id)/
// To extract the user id
const userIdReg = /(?<=&user_id=)(.*)$/
async function onPasteLogin(e: ClipboardEvent) {
  try {
    if (!e.clipboardData) {
      quasar.notify({
        message: 'No clipboard data',
        color: 'negative',
      })
      return
    }

    const {clipboardData} = e
    const text = clipboardData.getData('text')

    const testValidApiAccessCreds = testRegApiAccessCreds.test(text)
    if (!testValidApiAccessCreds) {
      quasar.notify({
        message: 'Invalid API access credentials',
        color: 'negative',
      })
      return
    }

    const apiKey = apiKeyReg.exec(text)?.[0]
    loginForm.value.api_key = apiKey ?? ''

    const userId = userIdReg.exec(text)?.[0]
    loginForm.value.user_id = userId ?? ''


    e.preventDefault()

  } catch (error) {
    console.error(error)
    quasar.notify({
      caption: 'Error',
      message: 'Unknown error while trying to parse the API access credentials, see console for more information',
      color: 'negative',
    })
  }
}

</script>

<style scoped>

</style>