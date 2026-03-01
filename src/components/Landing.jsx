import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function Landing({ onManagePresets }) {
  const presets = useStore((s) => s.presets)
  const selectPreset = useStore((s) => s.selectPreset)

  const handlePresetClick = (presetId) => {
    selectPreset(presetId)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:px-10 relative">
      <div className="ambient-glow" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 relative z-10"
      >
        <h1 
          className="text-7xl sm:text-8xl md:text-9xl font-bold mb-5 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-[var(--color-accent-violet-light)]">Date</span>
          <span className="text-[var(--color-accent-gold)]">Bite</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-xl sm:text-2xl max-w-xl mx-auto">
          Stop arguing. Start eating.<br />
          <span className="text-[var(--color-text-muted)] text-base sm:text-lg">Pick a mood. Pick a card. Dinner is served.</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5 relative z-10"
      >
        <p className="text-[var(--color-text-muted)] text-sm sm:text-base uppercase tracking-widest mb-5 text-center">
          Choose your mood
        </p>
        
        {presets.map((preset, i) => (
          <motion.button
            key={preset.id}
            onClick={() => handlePresetClick(preset.id)}
            disabled={preset.restaurants.length < 2}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-5 p-6 sm:p-7 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-glow)] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <span className="text-3xl sm:text-4xl">{preset.emoji}</span>
            <div className="text-left flex-1">
              <div className="font-semibold text-xl sm:text-2xl text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-violet-light)] transition-colors">
                {preset.name}
              </div>
              <div className="text-xl sm:text-2xl text-[var(--color-text-muted)] mt-1">
                {preset.restaurants.length} spot{preset.restaurants.length !== 1 ? 's' : ''}
                {preset.restaurants.length < 2 && ' — need at least 2'}
              </div>
            </div>
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-violet)] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl relative z-10"
      >
        <button
          onClick={onManagePresets}
          className="w-full sm:w-auto px-8 py-5 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-muted)] text-xl sm:text-2xl font-medium hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-glow)] hover:bg-[var(--color-bg-card)] transition-all cursor-pointer"
        >
          ✏️ Manage your presets
        </button>
      </motion.div>
    </div>
  )
}
