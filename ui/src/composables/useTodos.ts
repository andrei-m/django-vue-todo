import { ref } from 'vue'
import client from '../api/client'

export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
}

export function useTodos() {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchTodos() {
    loading.value = true
    error.value = ''
    try {
      const response = await client.get('/todos/')
      todos.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch todos.'
    } finally {
      loading.value = false
    }
  }

  async function addTodo(todo: Partial<Todo>) {
    try {
      const response = await client.post('/todos/', todo)
      todos.value.push(response.data)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data || 'Failed to add todo.' }
    }
  }

  async function updateTodo(id: number, updates: Partial<Todo>) {
    try {
      const response = await client.patch(`/todos/${id}/`, updates)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data || 'Failed to update todo.' }
    }
  }

  async function deleteTodo(id: number) {
    try {
      await client.delete(`/todos/${id}/`)
      todos.value = todos.value.filter(t => t.id !== id)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data || 'Failed to delete todo.' }
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  }
}
