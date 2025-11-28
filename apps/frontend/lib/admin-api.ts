import { BACKEND_URL } from "./config"

export interface QuestPair {
  id: string
  concept: string
  definition: string
  fact: string
}

export interface Quest {
  id: string
  name: string
  description: string
  reward: string // e.g., "0.10" (without cUSD)
  difficulty: "beginner" | "intermediate" | "advanced"
  isLocked: boolean
  isActive: boolean
  pairs: QuestPair[]
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

export interface CreateQuestInput {
  id: string
  name: string
  description: string
  reward: string
  difficulty: "beginner" | "intermediate" | "advanced"
  isLocked?: boolean
  isActive?: boolean
  pairs: QuestPair[]
}

export interface UpdateQuestInput {
  name?: string
  description?: string
  reward?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  isLocked?: boolean
  isActive?: boolean
  pairs?: QuestPair[]
}

/**
 * Get all quests (admin view - includes inactive)
 */
export async function getAdminQuests(
  authHeaders: HeadersInit,
  includeInactive: boolean = true
): Promise<Quest[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/admin/quests?includeInactive=${includeInactive}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
      }
    )

    if (!response.ok) {
      // Try to get error message from response
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
      }
      
      throw new Error(errorData.message || errorData.error || `Failed to fetch quests (${response.status})`)
    }

    const data = await response.json()
    return data.quests || []
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Cannot connect to backend. Please make sure the backend server is running on " + BACKEND_URL)
    }
    throw error
  }
}

/**
 * Get a specific quest by ID
 */
export async function getAdminQuest(authHeaders: HeadersInit, id: string): Promise<Quest> {
  const response = await fetch(`${BACKEND_URL}/api/admin/quests/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.message || error.error || "Failed to fetch quest")
  }

  const data = await response.json()
  return data.quest
}

/**
 * Create a new quest
 */
export async function createQuest(
  authHeaders: HeadersInit,
  quest: CreateQuestInput
): Promise<Quest> {
  const response = await fetch(`${BACKEND_URL}/api/admin/quests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(quest),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.message || error.errors?.join(", ") || error.error || "Failed to create quest")
  }

  const data = await response.json()
  return data.quest
}

/**
 * Update an existing quest
 */
export async function updateQuest(
  authHeaders: HeadersInit,
  id: string,
  updates: UpdateQuestInput
): Promise<Quest> {
  const response = await fetch(`${BACKEND_URL}/api/admin/quests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.message || error.error || "Failed to update quest")
  }

  const data = await response.json()
  return data.quest
}

/**
 * Delete a quest (soft delete by default)
 */
export async function deleteQuest(
  authHeaders: HeadersInit,
  id: string,
  hardDelete: boolean = false
): Promise<void> {
  const response = await fetch(
    `${BACKEND_URL}/api/admin/quests/${id}?hardDelete=${hardDelete}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.message || error.error || "Failed to delete quest")
  }
}

