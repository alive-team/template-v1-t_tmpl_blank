// SQLite database utilities for frontend
// Note: SQLite runs on the server side only (server.ts)
// Frontend should use fetch() to call API endpoints

// Example API call helper
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Example usage:
// const items = await fetchApi<Item[]>('/items')
// await fetchApi('/items', { method: 'POST', body: JSON.stringify({ name: 'New Item' }) })
