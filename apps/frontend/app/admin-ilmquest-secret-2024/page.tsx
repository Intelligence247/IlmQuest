"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { getAdminQuests, createQuest, updateQuest, deleteQuest, type Quest, type CreateQuestInput, type UpdateQuestInput } from "@/lib/admin-api"
import { BACKEND_URL } from "@/lib/config"
import { Plus, Edit, Trash2, Lock, Unlock, Eye, EyeOff, Loader2, Check, X } from "lucide-react"

export default function AdminPage() {
  const { isConnected, address } = useWallet()
  const { isAuthenticated, isAuthenticating, error: authError, authenticate, checkAuth, logout, getAuthHeaders } = useAdminAuth()
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Check auth on mount
  useEffect(() => {
    if (isConnected && address) {
      checkAuth()
    }
  }, [isConnected, address, checkAuth])

  // Load quests when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadQuests()
    }
  }, [isAuthenticated])

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`)
        if (!response.ok) {
          console.warn("Backend health check failed")
        }
      } catch (err) {
        console.error("Backend connection error:", err)
        // Don't set error here, let the actual API call handle it
      }
    }
    checkBackend()
  }, [])

  const loadQuests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if authenticated before trying to get headers
      if (!isAuthenticated) {
        setError("Please authenticate first")
        return
      }

      const authHeaders = getAuthHeaders()
      const data = await getAdminQuests(authHeaders, true)
      setQuests(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load quests"
      setError(errorMessage)
      console.error("Error loading quests:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete quest "${id}"?`)) return

    try {
      setError(null)
      const authHeaders = getAuthHeaders()
      await deleteQuest(authHeaders, id, false) // Soft delete
      await loadQuests()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quest")
    }
  }

  const handleToggleActive = async (quest: Quest) => {
    try {
      setError(null)
      const authHeaders = getAuthHeaders()
      await updateQuest(authHeaders, quest.id, { isActive: !quest.isActive })
      await loadQuests()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quest")
    }
  }

  const handleToggleLocked = async (quest: Quest) => {
    try {
      setError(null)
      const authHeaders = getAuthHeaders()
      await updateQuest(authHeaders, quest.id, { isLocked: !quest.isLocked })
      await loadQuests()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quest")
    }
  }

  // Not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl text-ui-text mb-4">Admin Panel</h1>
          <p className="text-ui-muted">Please connect your wallet to continue</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="font-heading font-bold text-2xl text-ui-text mb-2">Admin Authentication</h1>
          <p className="text-sm text-ui-muted mb-6">
            Sign a message with your admin wallet to access the admin panel.
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {authError}
            </div>
          )}

          <div className="mb-4 p-3 bg-brand-surface rounded-lg">
            <p className="text-xs text-ui-muted mb-1">Connected Wallet:</p>
            <p className="font-mono text-sm text-ui-text">{address}</p>
          </div>

          <button
            onClick={authenticate}
            disabled={isAuthenticating}
            className="w-full min-h-[48px] px-6 py-3 bg-brand-primary text-white font-heading font-semibold rounded-full shadow-md hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing Message...
              </>
            ) : (
              "Sign Message to Authenticate"
            )}
          </button>
        </div>
      </div>
    )
  }

  // Authenticated - Show admin panel
  return (
    <div className="min-h-screen bg-brand-surface p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-3xl text-ui-text mb-2">Admin Panel</h1>
            <p className="text-sm text-ui-muted">Manage quests and content</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-ui-muted hover:text-ui-text border border-ui-border rounded-lg hover:bg-white transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              setShowCreateForm(true)
              setEditingQuest(null)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-heading font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Quest
          </button>
          <button
            onClick={loadQuests}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-ui-border rounded-lg hover:bg-brand-surface transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
          </button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingQuest) && (
          <QuestForm
            quest={editingQuest}
            onClose={() => {
              setShowCreateForm(false)
              setEditingQuest(null)
            }}
            onSuccess={() => {
              setShowCreateForm(false)
              setEditingQuest(null)
              loadQuests()
            }}
            getAuthHeaders={getAuthHeaders}
          />
        )}

        {/* Quests List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
        ) : quests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-ui-border">
            <p className="text-ui-muted">No quests found. Create your first quest!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onEdit={() => setEditingQuest(quest)}
                onDelete={() => handleDelete(quest.id)}
                onToggleActive={() => handleToggleActive(quest)}
                onToggleLocked={() => handleToggleLocked(quest)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Quest Card Component
function QuestCard({
  quest,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleLocked,
}: {
  quest: Quest
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
  onToggleLocked: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-ui-border shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-heading font-bold text-lg text-ui-text">{quest.name}</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              quest.difficulty === "beginner" ? "bg-brand-secondary/20 text-brand-secondary" :
              quest.difficulty === "intermediate" ? "bg-brand-accent/20 text-brand-accent" :
              "bg-red-500/20 text-red-500"
            }`}>
              {quest.difficulty}
            </span>
            {!quest.isActive && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Inactive</span>
            )}
            {quest.isLocked && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">Locked</span>
            )}
          </div>
          <p className="text-sm text-ui-muted mb-2">{quest.description}</p>
          <p className="text-sm font-medium text-brand-accent">Reward: {quest.reward} cUSD</p>
          <p className="text-xs text-ui-muted mt-2">ID: {quest.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-ui-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleActive}
            className="p-2 text-ui-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
            title={quest.isActive ? "Deactivate" : "Activate"}
          >
            {quest.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleLocked}
            className="p-2 text-ui-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
            title={quest.isLocked ? "Unlock" : "Lock"}
          >
            {quest.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-xs text-ui-muted">
        {quest.pairs.length} pairs • Created: {quest.createdAt ? new Date(quest.createdAt).toLocaleDateString() : "N/A"}
      </div>
    </div>
  )
}

// Quest Form Component (simplified - you can expand this)
function QuestForm({
  quest,
  onClose,
  onSuccess,
  getAuthHeaders,
}: {
  quest: Quest | null
  onClose: () => void
  onSuccess: () => void
  getAuthHeaders: () => HeadersInit
}) {
  const [formData, setFormData] = useState<CreateQuestInput>({
    id: quest?.id || "",
    name: quest?.name || "",
    description: quest?.description || "",
    reward: quest?.reward || "0.10",
    difficulty: quest?.difficulty || "beginner",
    isLocked: quest?.isLocked || false,
    isActive: quest?.isActive ?? true,
    pairs: quest?.pairs || [
      { id: "", concept: "", definition: "", fact: "" },
      { id: "", concept: "", definition: "", fact: "" },
      { id: "", concept: "", definition: "", fact: "" },
      { id: "", concept: "", definition: "", fact: "" },
    ],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const authHeaders = getAuthHeaders()
      if (quest) {
        // For update, exclude id from the update payload
        const { id, ...updateData } = formData
        await updateQuest(authHeaders, quest.id, updateData)
      } else {
        await createQuest(authHeaders, formData)
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save quest")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mb-6 bg-white rounded-xl border border-ui-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-xl text-ui-text">
          {quest ? "Edit Quest" : "Create New Quest"}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-brand-surface rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ui-text mb-1">Quest ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              disabled={!!quest}
              className="w-full px-3 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-100"
              placeholder="e.g., nft-basics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ui-text mb-1">Reward (cUSD)</label>
            <input
              type="text"
              value={formData.reward}
              onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
              required
              className="w-full px-3 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="0.10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ui-text mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ui-text mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={2}
            className="w-full px-3 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ui-text mb-1">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
            className="w-full px-3 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <span className="text-sm text-ui-text">Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isLocked}
              onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
            />
            <span className="text-sm text-ui-text">Locked</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-ui-text mb-2">Card Pairs (4 required)</label>
          <div className="space-y-3">
            {formData.pairs.map((pair, index) => (
              <div key={index} className="p-3 border border-ui-border rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={pair.id}
                    onChange={(e) => {
                      const newPairs = [...formData.pairs]
                      newPairs[index].id = e.target.value
                      setFormData({ ...formData, pairs: newPairs })
                    }}
                    placeholder="Pair ID"
                    required
                    className="px-2 py-1 text-sm border border-ui-border rounded"
                  />
                  <input
                    type="text"
                    value={pair.concept}
                    onChange={(e) => {
                      const newPairs = [...formData.pairs]
                      newPairs[index].concept = e.target.value
                      setFormData({ ...formData, pairs: newPairs })
                    }}
                    placeholder="Concept"
                    required
                    className="px-2 py-1 text-sm border border-ui-border rounded"
                  />
                </div>
                <input
                  type="text"
                  value={pair.definition}
                  onChange={(e) => {
                    const newPairs = [...formData.pairs]
                    newPairs[index].definition = e.target.value
                    setFormData({ ...formData, pairs: newPairs })
                  }}
                  placeholder="Definition"
                  required
                  className="w-full px-2 py-1 text-sm border border-ui-border rounded"
                />
                <textarea
                  value={pair.fact}
                  onChange={(e) => {
                    const newPairs = [...formData.pairs]
                    newPairs[index].fact = e.target.value
                    setFormData({ ...formData, pairs: newPairs })
                  }}
                  placeholder="Educational fact"
                  required
                  rows={2}
                  className="w-full px-2 py-1 text-sm border border-ui-border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 min-h-[48px] px-6 py-3 bg-brand-primary text-white font-heading font-semibold rounded-lg hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                {quest ? "Update Quest" : "Create Quest"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-ui-border rounded-lg hover:bg-brand-surface transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

