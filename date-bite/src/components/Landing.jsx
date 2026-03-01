import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function Landing({ onManagePresets }) {
  const presets = useStore((s) => s.presets)
  const selectPreset = useStore((s) => s.selectPreset)

  const handlePresetClick = (presetId) => {
    selectPreset(presetId)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <div className="ambient-glow" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 
          className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-[var(--color-accent-violet-light)]">Date</span>
          <span className="text-[var(--color-accent-gold)]">Bite</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-md mx-auto">
          Stop arguing. Start eating.<br />
          <span className="text-[var(--color-text-muted)] text-sm">Pick a mood. Open a door. Dinner is served.</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full max-w-md space-y-3 relative z-10"
      >
        <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest mb-4 text-center">
          Choose your mood
        </p>
        
        {presets.map((preset, i) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            onClick={() => handlePresetClick(preset.id)}
            disabled={preset.restaurants.length < 2}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-glow)] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <span className="text-2xl">{preset.emoji}</span>
            <div className="text-left flex-1">
              <div className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-violet-light)] transition-colors">
                {preset.name}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {preset.restaurants.length} spot{preset.restaurants.length !== 1 ? 's' : ''}
                {preset.restaurants.length < 2 && ' — need at least 2'}
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-violet)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 relative z-10"
      >
        <button
          onClick={onManagePresets}
          className="text-[var(--color-text-muted)] text-xs hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
        >
          ✏️ Manage your presets
        </button>
      </motion.div>
    </div>
  )
}
