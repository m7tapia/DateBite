import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore'
import Landing from './components/Landing'
import PresetManager from './components/PresetManager'
import ShuffleScreen from './components/ShuffleScreen'
import RevealScreen from './components/RevealScreen'
import AftermathScreen from './components/AftermathScreen'

function App() {
  const [showPresets, setShowPresets] = useState(false)
  const activePreset = useStore((s) => s.activePreset)
  const gamePhase = useStore((s) => s.gamePhase)
  const startGame = useStore((s) => s.startGame)
  const goHome = useStore((s) => s.goHome)

  // Managing presets
  if (showPresets) {
    return <PresetManager onClose={() => setShowPresets(false)} />
  }

  // No preset selected — show landing
  if (!activePreset) {
    return <Landing onManagePresets={() => setShowPresets(true)} />
  }

  // Preset selected, game not started yet
  if (gamePhase === 'idle') {
    return <PreGameScreen onStart={startGame} onBack={goHome} preset={activePreset} />
  }

  // Game in progress
  return (
    <AnimatePresence mode="wait">
      {(gamePhase === 'shuffling' || gamePhase === 'choosing') && <ShuffleScreen key="shuffle" />}
      {gamePhase === 'revealing' && <RevealScreen key="reveal" />}
      {gamePhase === 'aftermath' && <AftermathScreen key="aftermath" />}
    </AnimatePresence>
  )
}

function PreGameScreen({ onStart, onBack, preset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-10 relative">
      <div className="ambient-glow" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10 w-full max-w-lg sm:max-w-2xl"
      >
        <span className="text-7xl sm:text-8xl mb-6 block">{preset.emoji}</span>
        <h2
          className="text-5xl sm:text-6xl font-bold text-[var(--color-text-primary)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {preset.name}
        </h2>
        <p className="text-[var(--color-text-muted)] text-lg sm:text-xl mb-6">
          {preset.restaurants.length} spots ready
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {preset.restaurants.map((r) => (
            <span key={r} className="px-4 py-2 text-base sm:text-lg rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
              {r}
            </span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full py-6 sm:py-7 rounded-2xl text-white font-bold text-2xl sm:text-3xl cursor-pointer"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--color-accent-violet) 0%, var(--color-accent-gold) 100%)',
          }}
        >
          Seal Your Fate
        </motion.button>

        <button
          onClick={onBack}
          className="mt-6 px-6 py-4 rounded-2xl border border-[var(--color-border)] text-lg sm:text-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] transition-all cursor-pointer"
        >
          ← Back to moods
        </button>
      </motion.div>
    </div>
  )
}

export default App
