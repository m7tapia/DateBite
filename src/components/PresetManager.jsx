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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:px-10 sm:py-12 relative z-10"
    >
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your Presets
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] mt-1.5">
              Build your go-to lists for any mood
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-4 rounded-2xl hover:bg-[var(--color-bg-card)] transition-colors cursor-pointer"
          >
            <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preset list */}
        <div className="space-y-5 mb-6 sm:mb-8">
          <AnimatePresence>
            {presets.map((preset) => (
              <motion.div
                key={preset.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden"
              >
                {/* Preset header */}
                <div
                  className="flex items-center gap-5 p-7 sm:p-8 cursor-pointer hover:bg-[var(--color-bg-card-hover)] transition-colors"
                  onClick={() => setEditingPreset(editingPreset === preset.id ? null : preset.id)}
                >
                  <span className="text-4xl sm:text-5xl">{preset.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-2xl sm:text-3xl text-[var(--color-text-primary)]">
                      {preset.name}
                    </div>
                    <div className="text-xl sm:text-2xl text-[var(--color-text-muted)] mt-1">
                      {preset.restaurants.length} spot{preset.restaurants.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <svg
                    className={`w-8 h-8 text-[var(--color-text-muted)] transition-transform duration-200 flex-shrink-0 ${editingPreset === preset.id ? 'rotate-180' : ''}`}
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
                      <div className="px-6 sm:px-8 pb-7 sm:pb-9 border-t border-[var(--color-border)]">
                        {/* Restaurant list */}
                        <div className="mt-6 space-y-4">
                          {preset.restaurants.map((restaurant) => (
                            <div
                              key={restaurant}
                              className="flex items-center justify-between py-6 px-7 rounded-2xl bg-[var(--color-bg-secondary)]"
                            >
                              <span className="text-2xl sm:text-3xl text-[var(--color-text-secondary)]">
                                {restaurant}
                              </span>
                              <button
                                onClick={() => removeRestaurantFromPreset(preset.id, restaurant)}
                                className="p-4 ml-3 rounded-xl hover:bg-[var(--color-danger)]/20 hover:text-[var(--color-danger)] text-[var(--color-text-muted)] transition-all cursor-pointer flex-shrink-0"
                              >
                                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add restaurant input */}
                        <div className="mt-5 flex gap-3">
                          <input
                            type="text"
                            placeholder="Add a spot..."
                            value={newRestaurant}
                            onChange={(e) => setNewRestaurant(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddRestaurant(preset.id)}
                            className="flex-1 px-6 py-7 text-2xl sm:text-3xl rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-violet)] transition-colors"
                          />
                          <button
                            onClick={() => handleAddRestaurant(preset.id)}
                            className="px-8 py-7 text-2xl sm:text-3xl rounded-2xl bg-[var(--color-accent-violet)] text-white font-semibold hover:bg-[var(--color-accent-violet-light)] transition-colors cursor-pointer"
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
                          className="mt-5 w-full py-6 rounded-2xl border border-[var(--color-danger)]/30 text-xl sm:text-2xl text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors cursor-pointer font-medium"
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
        <AnimatePresence initial={false}>
          {showNewPreset ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 sm:p-6 rounded-2xl border border-[var(--color-border-glow)] bg-[var(--color-bg-card)]"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Preset name (e.g. Late Night)"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePreset()}
                  className="w-full px-6 py-6 text-xl sm:text-2xl rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-violet)] transition-colors"
                />
                <div>
                  <p className="text-base sm:text-lg text-[var(--color-text-muted)] mb-3">Pick an icon</p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewPresetEmoji(emoji)}
                        className={`rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer ${
                          newPresetEmoji === emoji
                            ? 'bg-[var(--color-accent-violet)] scale-110'
                            : 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-card-hover)]'
                        }`}
                        style={{ width: '56px', height: '56px' }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-accent-violet)] flex items-center justify-center text-2xl flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                      {newPresetEmoji}
                    </div>
                    <input
                      type="text"
                      placeholder="Or type your own emoji..."
                      onChange={(e) => {
                        const val = [...e.target.value].filter((c) =>
                          /\p{Emoji}/u.test(c)
                        )
                        if (val.length > 0) setNewPresetEmoji(val[val.length - 1])
                      }}
                      className="flex-1 px-6 py-6 text-xl sm:text-2xl rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-violet)] transition-colors"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewPreset(false)}
                    className="flex-1 py-5 text-xl sm:text-2xl rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePreset}
                    disabled={!newPresetName.trim()}
                    className="flex-1 py-5 text-xl sm:text-2xl rounded-2xl bg-[var(--color-accent-violet)] text-white font-semibold hover:bg-[var(--color-accent-violet-light)] transition-colors cursor-pointer disabled:opacity-40"
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
              className="w-full py-9 rounded-2xl border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-violet)] hover:text-[var(--color-accent-violet-light)] transition-all cursor-pointer text-2xl sm:text-3xl font-medium"
            >
              + New Preset
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
