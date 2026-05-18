import { describe, it, expect, vi } from 'vitest'
import { useAuth } from '../useAuth'
import client from '../../api/client'

vi.mock('../../api/client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('useAuth', () => {
  it('should initialize with isAuthenticated as false', () => {
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated.value).toBe(false)
  })

  it('should set isAuthenticated to true on successful login', async () => {
    const { login, isAuthenticated } = useAuth()
    vi.mocked(client.post).mockResolvedValueOnce({ data: {} })

    const result = await login({ username: 'test', password: 'password' })

    expect(result.success).toBe(true)
    expect(isAuthenticated.value).toBe(true)
  })

  it('should set isAuthenticated to false on logout and refresh page', async () => {
    // Mock window.location
    const originalLocation = window.location
    delete (window as any).location
    window.location = { href: '' } as any

    const { logout, isAuthenticated } = useAuth()
    vi.mocked(client.post).mockResolvedValueOnce({ data: {} })

    await logout()

    expect(client.post).toHaveBeenCalledWith('/logout/')
    expect(isAuthenticated.value).toBe(false)
    expect(window.location.href).toBe('/')

    window.location = originalLocation
  })
})
