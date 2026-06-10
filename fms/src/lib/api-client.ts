import { getApiBaseUrl } from "@/lib/env"

const ARTIFICIAL_DELAY_MS = 300

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function simulatedFetch<T>(
  dataCallback: () => T | Promise<T>,
  delay: number = ARTIFICIAL_DELAY_MS
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await dataCallback()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}

type ApiEnvelope<T> = {
  success: boolean
  message?: string
  errorCode?: string
  data?: T
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "")
  const url = path.startsWith("http") ? path : `${base}${path}`

  const token =
    typeof window !== "undefined" ? localStorage.getItem("fms-access-token") : null

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !body?.success) {
    throw new ApiError(
      body?.message ?? `Request failed (${response.status})`,
      response.status,
      body?.errorCode
    )
  }

  return body.data as T
}

export function storeAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("fms-access-token", accessToken)
  localStorage.setItem("fms-refresh-token", refreshToken)
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return
  localStorage.removeItem("fms-access-token")
  localStorage.removeItem("fms-refresh-token")
}
