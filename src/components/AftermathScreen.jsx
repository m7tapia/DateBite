import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function AftermathScreen() {
  const revealedRestaurant = useStore((s) => s.revealedRestaurant)
  const otherOptions = useStore((s) => s.otherOptions)
  const resetGame = useStore((s) => s.resetGame)
  const goHome = useStore((s) => s.goHome)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="ambient-glow" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 w-full max-w-xl sm:max-w-2xl"
      >
        {/* Winner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[var(--color-text-muted)] text-base sm:text-lg uppercase tracking-widest mb-4">
            It's decided
          </p>
          <h2
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-5"
            style={{ 
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, var(--color-accent-violet-light) 0%, var(--color-accent-gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {revealedRestaurant}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg sm:text-xl">
            No debates. No excuses. Go eat. 🍽️
          </p>
        </motion.div>

        {/* What you missed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-10"
        >
          <p className="text-[var(--color-text-muted)] text-sm sm:text-base uppercase tracking-widest mb-5">
            Behind the other cards...
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
            {otherOptions.map((option, i) => (
              <motion.div
                key={option}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: 1.2 + i * 0.3, duration: 0.5, type: 'spring' }}
                className="px-5 py-3 sm:px-6 sm:py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)]"
              >
                <span className="text-base sm:text-lg line-through opacity-60">{option}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="space-y-3"
        >
          <button
            onClick={resetGame}
            className="w-full py-5 sm:py-6 rounded-2xl bg-[var(--color-accent-violet)] text-white font-semibold hover:bg-[var(--color-accent-violet-light)] transition-colors cursor-pointer text-xl sm:text-2xl"
          >
            Seal Your Fate Again
          </button>
          <button
            onClick={goHome}
            className="w-full py-5 sm:py-6 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] transition-colors cursor-pointer text-xl sm:text-2xl"
          >
            Switch Mood
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
