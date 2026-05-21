<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h1 class="text-h4">To-dos</h1>
        <div>
          <v-btn color="primary" prepend-icon="mdi-plus" class="mr-2" @click="openDialog()">Add Task</v-btn>
          <v-btn variant="text" color="error" prepend-icon="mdi-logout" @click="handleLogout">Logout</v-btn>
        </div>
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
        <div v-else-if="Object.keys(groupedTodos).length > 0">
          <div v-for="(dateGroup, dateKey) in groupedTodos" :key="dateKey" class="mb-6">
            <h2 class="text-h6 mb-2 border-bottom pb-1">
              {{ formatDateHeading(dateKey) }}
            </h2>
            <v-list lines="two">
              <v-list-item
                v-for="todo in dateGroup"
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
          </div>
        </div>
        <v-card v-else class="text-center py-10" variant="tonal">
          <v-card-text>No tasks yet. Click "Add Task" to get started!</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedId ? 'Edit Task' : 'New Task' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.title"
                  label="Title"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="editedItem.description"
                  label="Description"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-subtitle-1 mb-2">Due Date (Optional)</div>
                <v-date-picker
                  v-model="editedItem.due_date"
                  hide-header
                  color="primary"
                  width="100%"
                ></v-date-picker>
                <v-btn
                  v-if="editedItem.due_date"
                  variant="text"
                  size="small"
                  color="grey"
                  @click="editedItem.due_date = null"
                >
                  Clear Date
                </v-btn>
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
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTodos } from '../composables/useTodos'
import type { Todo } from '../composables/useTodos'
import { useAuth } from '../composables/useAuth'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'

dayjs.extend(advancedFormat)
dayjs.extend(utc)

const { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodos()
const { logout } = useAuth()
const router = useRouter()

const dialog = ref(false)
const saving = ref(false)
const editedId = ref<number | null>(null)
const editedItem = reactive<{
  title: string
  description: string
  due_date: Date | null
}>({
  title: '',
  description: '',
  due_date: null,
})

const groupedTodos = computed(() => {
  const groups: { [key: string]: Todo[] } = {}

  // Sort todos by due_date reverse-chronologically
  const sortedTodos = [...todos.value].sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0
    if (!a.due_date) return 1
    if (!b.due_date) return -1
    return dayjs.utc(b.due_date).unix() - dayjs.utc(a.due_date).unix()
  })

  // Separate "No Due Date" group for the end
  const datedTodos = sortedTodos.filter(t => t.due_date)
  const nonDatedTodos = sortedTodos.filter(t => !t.due_date)

  datedTodos.forEach(todo => {
    const dateKey = dayjs.utc(todo.due_date).format('YYYY-MM-DD')
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(todo)
  })

  if (nonDatedTodos.length > 0) {
    groups['none'] = nonDatedTodos
  }

  return groups
})

function formatDateHeading(dateKey: string) {
  if (dateKey === 'none') return 'No Due Date'
  return dayjs.utc(dateKey).format('MMM Do, YYYY')
}

onMounted(() => {
  fetchTodos()
})

function openDialog(todo?: Todo) {
  if (todo) {
    editedId.value = todo.id
    editedItem.title = todo.title
    editedItem.description = todo.description
    editedItem.due_date = todo.due_date ? dayjs.utc(todo.due_date).toDate() : null
  } else {
    editedId.value = null
    editedItem.title = ''
    editedItem.description = ''
    editedItem.due_date = null
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

async function saveTodo() {
  saving.value = true

  // Format date to ISO string (YYYY-MM-DD) for backend
  const payload = {
    ...editedItem,
    due_date: editedItem.due_date ? dayjs.utc(editedItem.due_date).format('YYYY-MM-DD') : null
  }

  if (editedId.value) {
    await updateTodo(editedId.value, payload)
  } else {
    await addTodo(payload)
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

async function handleLogout() {
  await logout()
  // Refresh handled by logout composable now
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
