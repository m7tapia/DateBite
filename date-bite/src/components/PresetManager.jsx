import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const EMOJI_OPTIONS = ['⚡', '🕯️', '🍕', '🌮', '🍔', '🍣', '🥗', '🍝', '🍜', '🔥', '💜', '🌙', '☀️', '🎉']

export default function PresetManager({ onClose }) {
  const presets = useStore((s) => s.presets)
  const addPreset = useStore((s) => s.addPreset)
  const deletePreset = useStore((s) => s.deletePreset)
  const addRestaurantToPreset = useStore((s) => s.addRestaurantToPreset)
  const removeRestaurantFromPreset = useStore((s) => s.removeRestaurantFromPreset)
  const updatePreset = useStore((s) => s.updatePreset)

  const [editingPreset, setEditingPreset] = useState(null)
  const [newRestaurant, setNewRestaurant] = useState('')
  const [showNewPreset, setShowNewPreset] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [newPresetEmoji, setNewPresetEmoji] = useState('⚡')

  const handleAddRestaurant = (presetId) => {
    if (newRestaurant.trim()) {
      addRestaurantToPreset(presetId, newRestaurant.trim())
      setNewRestaurant('')
    }
  }

  const handleCreatePreset = () => {
    if (newPresetName.trim()) {
      addPreset({
        name: newPresetName.trim(),
        emoji: newPresetEmoji,
        restaurants: [],
      })
      setNewPresetName('')
      setNewPresetEmoji('⚡')
      setShowNewPreset(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-6 py-8 relative z-10"
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-2xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your Presets
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Build your go-to lists for any mood
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-card)] transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preset list */}
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {presets.map((preset) => (
              <motion.div
                key={preset.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden"
              >
                {/* Preset header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[var(--color-bg-card-hover)] transition-colors"
                  onClick={() => setEditingPreset(editingPreset === preset.id ? null : preset.id)}
                >
                  <span className="text-xl">{preset.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-[var(--color-text-primary)]">
                      {preset.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {preset.restaurants.length} spot{preset.restaurants.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 ${editingPreset === preset.id ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded edit view */}
                <AnimatePresence>
                  {editingPreset === preset.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-[var(--color-border)]">
                        {/* Restaurant list */}
                        <div className="mt-3 space-y-2">
                          {preset.restaurants.map((restaurant) => (
                            <div
                              key={restaurant}
                              className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[var(--color-bg-secondary)] group"
                            >
                              <span className="text-sm text-[var(--color-text-secondary)]">
                                {restaurant}
                              </span>
                              <button
                                onClick={() => removeRestaurantFromPreset(preset.id, restaurant)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-[var(--color-danger)] transition-all cursor-pointer"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add restaurant input */}
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a spot..."
                            value={newRestaurant}
                            onChange={(e) => setNewRestaurant(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddRestaurant(preset.id)}
                            className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-violet)] transition-colors"
                          />
                          <button
                            onClick={() => handleAddRestaurant(preset.id)}
                            className="px-3 py-2 text-sm rounded-lg bg-[var(--color-accent-violet)] text-white font-medium hover:bg-[var(--color-accent-violet-light)] transition-colors cursor-pointer"
                          >
                            Add
                          </button>
                        </div>

                        {/* Delete preset */}
                        <button
                          onClick={() => {
                            deletePreset(preset.id)
                            setEditingPreset(null)
                          }}
                          className="mt-3 text-xs text-[var(--color-danger)] hover:underline cursor-pointer"
                        >
                          Delete this preset
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* New preset form */}
        <AnimatePresence>
          {showNewPreset ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl border border-[var(--color-border-glow)] bg-[var(--color-bg-card)]"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Preset name (e.g. Late Night)"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePreset()}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-violet)] transition-colors"
                  autoFocus
                />
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">Pick an icon</p>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewPresetEmoji(emoji)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer ${
                          newPresetEmoji === emoji
                            ? 'bg-[var(--color-accent-violet)] scale-110'
                            : 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-card-hover)]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewPreset(false)}
                    className="flex-1 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePreset}
                    disabled={!newPresetName.trim()}
                    className="flex-1 py-2 text-sm rounded-lg bg-[var(--color-accent-violet)] text-white font-medium hover:bg-[var(--color-accent-violet-light)] transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowNewPreset(true)}
              className="w-full p-4 rounded-xl border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-violet)] hover:text-[var(--color-accent-violet-light)] transition-all cursor-pointer text-sm"
            >
              + New Preset
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
