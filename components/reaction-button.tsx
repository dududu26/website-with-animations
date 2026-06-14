'use client'

import { useState, useEffect } from 'react'

interface ReactionButtonProps {
  targetId: number
  targetType: 'post' | 'comment'
  currentUserId?: string
}

const REACTION_TYPES = [
  { type: 'like', emoji: '👍', label: 'Suka' },
  { type: 'love', emoji: '❤️', label: 'Cinta' },
  { type: 'wow', emoji: '🤩', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sedih' },
  { type: 'angry', emoji: '😠', label: 'Marah' },
]

export function ReactionButton({ targetId, targetType, currentUserId }: ReactionButtonProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchReactions()
  }, [targetId, targetType])

  const fetchReactions = async () => {
    try {
      const response = await fetch(
        `/api/reactions?type=${targetType}&targetId=${targetId}`
      )
      if (response.ok) {
        const data = await response.json()
        const counts: Record<string, number> = {}
        const userReactionSet = new Set<string>()

        data.reactions.forEach((reaction: any) => {
          counts[reaction.reactionType] = (counts[reaction.reactionType] || 0) + 1
          if (reaction.userId === currentUserId) {
            userReactionSet.add(reaction.reactionType)
          }
        })

        setReactions(counts)
        setUserReactions(userReactionSet)
      }
    } catch (error) {
      console.error('Error fetching reactions:', error)
    }
  }

  const handleReaction = async (reactionType: string) => {
    if (!currentUserId) {
      alert('Silakan login terlebih dahulu')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: targetType,
          targetId,
          reactionType,
        }),
      })

      if (response.ok) {
        const wasActive = userReactions.has(reactionType)
        const newCount = (reactions[reactionType] || 0) + (wasActive ? -1 : 1)

        setReactions(prev => ({
          ...prev,
          [reactionType]: newCount,
        }))

        const newUserReactions = new Set(userReactions)
        if (wasActive) {
          newUserReactions.delete(reactionType)
        } else {
          newUserReactions.add(reactionType)
        }
        setUserReactions(newUserReactions)
      }
    } catch (error) {
      console.error('Error sending reaction:', error)
      alert('Gagal mengirim reaksi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 py-3 border-t border-border pt-3">
      {REACTION_TYPES.map(reaction => (
        <button
          key={reaction.type}
          onClick={() => handleReaction(reaction.type)}
          disabled={isLoading}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
            userReactions.has(reaction.type)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-accent'
          } disabled:opacity-50`}
          title={reaction.label}
        >
          <span>{reaction.emoji}</span>
          <span className="text-xs font-medium">
            {reactions[reaction.type] || 0}
          </span>
        </button>
      ))}
    </div>
  )
}
