import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

// Precompute spread positions so they don't shift on re-render
function getSpreadPositions(count) {
  const positions = []
  const cols = Math.min(count, 4)
  const rows = Math.ceil(count / cols)
  const colGap = 90
  const rowGap = 120

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const rowCount = row === rows - 1 ? count - row * cols : cols
    const offsetX = col * colGap - ((rowCount - 1) * colGap) / 2
    const offsetY = row * rowGap - ((rows - 1) * rowGap) / 2
    positions.push({ x: offsetX, y: offsetY, rotate: (Math.random() - 0.5) * 10 })
  }
  return positions
}

function getShufflePositions(count) {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 280,
    y: (Math.random() - 0.5) * 180,
    rotate: (Math.random() - 0.5) * 50,
  }))
}

const DEAL_POSITIONS_3 = [
  { x: -110, y: 90, rotate: -4 },
  { x: 0,    y: 80, rotate: 0  },
  { x: 110,  y: 90, rotate: 4  },
]
const DEAL_POSITIONS_2 = [
  { x: -65, y: 90, rotate: -4 },
  { x: 65,  y: 90, rotate: 4  },
]
function getDealPositions(count) {
  return count === 2 ? DEAL_POSITIONS_2 : DEAL_POSITIONS_3
}

export default function ShuffleScreen() {
  const activePreset = useStore((s) => s.activePreset)
  const chooseDoor = useStore((s) => s.chooseDoor)
  const doors = useStore((s) => s.doors)

  // phases: spread → shuffle → gather → deal
  const [phase, setPhase] = useState('spread')
  const [label, setLabel] = useState('Shuffling the deck...')
  const [canPick, setCanPick] = useState(false)

  const restaurants = activePreset.restaurants
  const count = restaurants.length

  const spreadPositions = useMemo(() => getSpreadPositions(count), [count])
  const shufflePositions = useMemo(() => getShufflePositions(count), [count])

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('shuffle'); setLabel('Mixing things up...') },    800)
    const t2 = setTimeout(() => { setPhase('gather');  setLabel('Drawing your fate...') },   2300)
    const t3 = setTimeout(() => { setPhase('deal');    setLabel('Tap a card.') },              3200)
    const t4 = setTimeout(() => { setCanPick(true) },                                          3900)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.35, ease: 'easeIn' } }}
    >
      <div className="ambient-glow" />

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1/4 text-[var(--color-text-muted)] text-base sm:text-lg uppercase tracking-widest z-20"
        >
          {label}
        </motion.p>
      </AnimatePresence>

      {/* Card stage */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center z-10">
        {restaurants.map((name, i) => {
          const isDealCard = phase === 'deal' && doors.includes(name)
          const dealIndex   = phase === 'deal' ? doors.indexOf(name) : -1
          const isEliminated = phase === 'deal' && !doors.includes(name)
          const DEAL_POSITIONS = getDealPositions(doors.length)

          // Compute target position based on phase
          let target = {}
          if (phase === 'spread') {
            target = spreadPositions[i]
          } else if (phase === 'shuffle') {
            target = shufflePositions[i]
          } else if (phase === 'gather') {
            target = { x: 0, y: 0, rotate: (i % 3 - 1) * 2 }
          } else if (phase === 'deal') {
            if (isDealCard) {
              target = DEAL_POSITIONS[dealIndex]
            } else {
              target = { x: 0, y: 0, rotate: (i % 3 - 1) * 2 }
            }
          }

          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.7, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: isEliminated ? 0 : 1,
                scale: isDealCard && canPick ? 1.05 : isDealCard ? 1.05 : 1,
                x: target.x,
                y: target.y,
                rotate: target.rotate,
                zIndex: isDealCard ? 10 + dealIndex : phase === 'gather' || phase === 'deal' ? i : 1,
              }}
              transition={{
                duration: phase === 'shuffle' ? 0.55 : phase === 'gather' ? 0.5 : phase === 'deal' ? 0.55 : 0.4,
                delay: phase === 'spread'
                  ? i * 0.07
                  : phase === 'shuffle'
                  ? i * 0.04
                  : phase === 'gather'
                  ? i * 0.03
                  : isDealCard
                  ? dealIndex * 0.12
                  : 0,
                type: phase === 'deal' && isDealCard ? 'spring' : 'tween',
                stiffness: 200,
                damping: 20,
                ease: 'easeInOut',
              }}
              whileHover={canPick && isDealCard ? { scale: 1.12, y: target.y - 8 } : {}}
              whileTap={canPick && isDealCard ? { scale: 0.97 } : {}}
              onClick={() => canPick && isDealCard && chooseDoor(dealIndex)}
              className={`absolute ${canPick && isDealCard ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ transformOrigin: 'center center' }}
            >
              <div
                className={`
                  w-24 h-36 sm:w-28 sm:h-40 rounded-xl border flex items-center justify-center text-center px-2
                  select-none
                  ${phase === 'gather' || (phase === 'deal' && !isDealCard)
                    ? 'bg-[var(--color-bg-card)] border-[var(--color-border)]'
                    : 'bg-[var(--color-bg-card)] border-[var(--color-border)]'
                  }
                  ${isDealCard && canPick
                    ? 'border-[var(--color-accent-violet)] shadow-[0_0_24px_rgba(139,92,246,0.45)]'
                    : isDealCard
                    ? 'border-[var(--color-accent-violet)] shadow-[0_0_18px_rgba(139,92,246,0.35)]'
                    : ''
                  }
                `}
                style={{
                  background: phase === 'gather' || (phase === 'deal' && !isDealCard)
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #12121a 100%)'
                    : undefined,
                }}
              >
                {/* Show name when spread/shuffle; face-down pattern when gathered */}
                {(phase === 'spread' || phase === 'shuffle') ? (
                  <span
                    className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {name}
                  </span>
                ) : (
                  <div className="w-full h-full rounded-xl flex items-center justify-center">
                    {/* Card back pattern */}
                    <div
                      className="w-12 h-18 rounded-lg opacity-20"
                      style={{
                        background: isDealCard
                          ? 'linear-gradient(135deg, var(--color-accent-violet) 0%, var(--color-accent-gold) 100%)'
                          : 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)',
                        width: '48px',
                        height: '64px',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Prompt during deal phase */}
      <AnimatePresence>
        {phase === 'deal' && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: canPick ? 1 : 0, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute z-20 text-base sm:text-lg font-semibold text-[var(--color-accent-violet-light)] uppercase tracking-widest"
            style={{ top: 'calc(50% + 200px)' }}
          >
            Tap a card to choose
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

