<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-alert v-if="router.currentRoute.value.query.registered" type="success" class="mb-3">
              Registration successful! Please login.
            </v-alert>
            <v-form @submit.prevent="handleLogin" id="login-form">
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
            </v-form>
            <v-alert v-if="error" type="error" class="mt-3">
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="secondary" to="/register">Register</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" form="login-form" :loading="loading">Login</v-btn>
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
const loading = ref(false)
const error = ref('')

const router = useRouter()
const { login } = useAuth()

async function handleLogin() {
  loading.value = true
  error.value = ''
  const result = await login({ username: username.value, password: password.value })
  loading.value = false
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error?.detail || 'Login failed. Please check your credentials.'
  }
}
</script>
