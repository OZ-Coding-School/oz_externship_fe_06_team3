import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export function setupAuthInterceptor(
  client: AxiosInstance,
  getAccessToken: () => string | null
) {
  const id = client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }
  )

  return () => client.interceptors.request.eject(id)
}
