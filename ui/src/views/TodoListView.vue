<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h1 class="text-h4">To-dos</h1>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">Add Task</v-btn>
        <v-btn variant="text" color="error" prepend-icon="mdi-logout" @click="handleLogout">Logout</v-btn>
      </v-col>
    </v-row>

    <v-row v-if="error">
      <v-col cols="12">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        <v-list lines="two" v-else-if="todos.length > 0">
          <v-list-item
            v-for="todo in todos"
            :key="todo.id"
            :title="todo.title"
            :subtitle="todo.description"
            :class="{ 'text-decoration-line-through': todo.completed }"
          >
            <template v-slot:prepend>
              <v-checkbox-btn
                v-model="todo.completed"
                @change="toggleTodo(todo)"
              ></v-checkbox-btn>
            </template>

            <template v-slot:append>
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="info"
                @click="openDialog(todo)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="handleDelete(todo.id)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
        <v-card v-else class="text-center py-10" variant="tonal">
          <v-card-text>No tasks yet. Click "Add Task" to get started!</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedId ? 'Edit Task' : 'New Task' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.title"
                  label="Title"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="text" @click="saveTodo" :loading="saving">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTodos } from '../composables/useTodos'
import type { Todo } from '../composables/useTodos'
import { useAuth } from '../composables/useAuth'

const { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodos()
const { logout } = useAuth()
const router = useRouter()

const dialog = ref(false)
const saving = ref(false)
const editedId = ref<number | null>(null)
const editedItem = reactive({
  title: '',
  description: '',
})

onMounted(() => {
  fetchTodos()
})

function openDialog(todo?: Todo) {
  if (todo) {
    editedId.value = todo.id
    editedItem.title = todo.title
    editedItem.description = todo.description
  } else {
    editedId.value = null
    editedItem.title = ''
    editedItem.description = ''
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

async function saveTodo() {
  saving.value = true
  if (editedId.value) {
    await updateTodo(editedId.value, editedItem)
  } else {
    await addTodo(editedItem)
  }
  saving.value = false
  closeDialog()
}

async function toggleTodo(todo: Todo) {
  await updateTodo(todo.id, { completed: todo.completed })
}

async function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this task?')) {
    await deleteTodo(id)
  }
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>
