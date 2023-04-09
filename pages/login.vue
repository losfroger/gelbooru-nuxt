<template>
  <div class="tw-flex tw-h-[80vh] tw-flex-row tw-items-center">
    <v-card class="tw-max-w-xl tw-shadow-md">
      <v-card-title class="tw-flex tw-flex-row tw-items-center tw-gap-4 tw-pt-4">
        <img
          src="/gelbooru-logo.svg"
          class="tw-hidden tw-w-8 lg:tw-block"
        >
        Login
      </v-card-title>
      <v-divider class="tw-my-4" />
      <v-card-text>
        <v-form
          ref="loginForm"
          :disabled="loadingForm || authStore.logged_in_computed"
          @paste="testApiKeyClipboard"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.user_id"
                prepend-inner-icon="mdi-account"
                label="User ID"
                :rules="[(v) => !!v || 'Please provide your user ID']"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.api_key"
                label="API Key"
                prepend-inner-icon="mdi-key"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="[(v) => !!v || 'Please provide your API key']"
                @click:append-inner="showPassword = !showPassword"
              />
            </v-col>
          </v-row>
        </v-form>
        <p class="tw-mt-8">
          To access the Gelbooru API we need your access credentials. You can see your credentials in <a
            href="https://gelbooru.com/index.php?page=account&s=options"
            target="_blank"
          >here</a>
        </p>
        <br>
        <p>
          (You can paste your API credentials inside the textbox)
        </p>
        <v-card-actions class="tw-mt-8">
          <v-spacer />
          <v-btn
            color="primary"
            :loading="loadingForm"
            :disabled="authStore.logged_in_computed"
            @click="onSubmit"
          >
            Access
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div
            v-if="authStore.logged_in_computed"
            class="tw-text-center tw-text-success"
          >
            Logged in correctly!
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { VForm } from 'vuetify/lib/components/VForm/index'


definePageMeta({
  middleware: 'redirect-login-middleware'
})

const loginForm = ref<VForm | null>(null)
const authStore = useAuthStore()
const router = useRouter()

const showPassword = ref(false)
const loadingForm = ref(false)
const form = ref({
  api_key: '',
  user_id: '',
})

async function testApiKeyClipboard(e: ClipboardEvent) {
  if (e.clipboardData) {
    const {clipboardData} = e
    const text = clipboardData.getData('text')

    const reg = new RegExp(/^&api_key=.*&user_id=\d*$/)

    const aux = reg.test(text)

    if (!aux) {
      return
    }

    const apiKeyReg = new RegExp(/(?<=^&api_key=)(.*)(?=&user_id)/)
    const apiKey = apiKeyReg.exec(text)?.[0]

    form.value.api_key = apiKey ?? ''

    const userIdReg = new RegExp(/(?<=&user_id=)(.*)$/)
    const userId = userIdReg.exec(text)?.[0]

    form.value.user_id = userId ?? ''

    e.preventDefault()
  }
}

async function onSubmit() {
  const validForm = await loginForm.value?.validate()
  if (!validForm?.valid) {
    console.log('Not valid!')
    return
  }

  loadingForm.value = true

  authStore.login(form.value.api_key, form.value.user_id)
  .then(() => {
    router.push('/favorites')
  })
  .catch((err) => {
    console.log('Error', err)
    loadingForm.value = false
  })
}

</script>

<style lang="scss" scoped>

</style>