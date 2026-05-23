import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTodos } from '../useTodos'
import client from '../../api/client'

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch todos without filters', async () => {
    const { fetchTodos, todos } = useTodos()
    const mockData = [{ id: 1, title: 'Test Todo', completed: false }]
    vi.mocked(client.get).mockResolvedValueOnce({ data: mockData })

    await fetchTodos()

    expect(client.get).toHaveBeenCalledWith('/todos/')
    expect(todos.value).toEqual(mockData)
  })

  it('should fetch todos with completed filter', async () => {
    const { fetchTodos } = useTodos()
    vi.mocked(client.get).mockResolvedValueOnce({ data: [] })

    await fetchTodos({ completed: true })

    expect(client.get).toHaveBeenCalledWith('/todos/?completed=true')

    await fetchTodos({ completed: false })
    expect(client.get).toHaveBeenCalledWith('/todos/?completed=false')
  })

  it('should handle fetch errors', async () => {
    const { fetchTodos, error } = useTodos()
    vi.mocked(client.get).mockRejectedValueOnce({
      response: { data: { detail: 'Error message' } }
    })

    await fetchTodos()

    expect(error.value).toBe('Error message')
  })
})
