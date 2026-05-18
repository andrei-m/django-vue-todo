<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="secondary" dark flat>
            <v-toolbar-title>Register</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleRegister" id="register-form">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                prepend-icon="mdi-lock-check"
                type="password"
                required
              ></v-text-field>
            </v-form>
            <v-alert v-if="error" type="error" class="mt-3">
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" to="/login">Back to Login</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="secondary" type="submit" form="register-form" :loading="loading">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const router = useRouter()
const { register } = useAuth()

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  error.value = ''
  const result = await register({ username: username.value, password: password.value })
  loading.value = false
  
  if (result.success) {
    router.push({ name: 'login', query: { registered: 'true' } })
  } else {
    // Basic error parsing for Django Rest Framework errors
    if (typeof result.error === 'object') {
      error.value = Object.entries(result.error)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ')
    } else {
      error.value = result.error || 'Registration failed.'
    }
  }
}
</script>
