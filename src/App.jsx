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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="ambient-glow" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10 w-full max-w-sm sm:max-w-lg"
      >
        <span className="text-6xl sm:text-7xl mb-5 block">{preset.emoji}</span>
        <h2
          className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {preset.name}
        </h2>
        <p className="text-[var(--color-text-muted)] text-base sm:text-lg mb-5">
          {preset.restaurants.length} spots ready
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {preset.restaurants.map((r) => (
            <span key={r} className="px-3 py-1.5 text-sm sm:text-base rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
              {r}
            </span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full py-5 sm:py-6 rounded-2xl text-white font-bold text-xl sm:text-2xl cursor-pointer"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--color-accent-violet) 0%, var(--color-accent-gold) 100%)',
          }}
        >
          Seal Your Fate
        </motion.button>

        <button
          onClick={onBack}
          className="mt-5 text-base sm:text-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
        >
          ← Back to moods
        </button>
      </motion.div>
    </div>
  )
}

export default App
