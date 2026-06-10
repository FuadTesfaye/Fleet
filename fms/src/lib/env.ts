export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? ""
  }
  return process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ""
}

export function isApiEnabled(): boolean {
  return getApiBaseUrl().length > 0
}
