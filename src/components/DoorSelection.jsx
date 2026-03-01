import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const doorColors = [
  'from-violet-900/40 to-violet-800/20',
  'from-purple-900/40 to-purple-800/20',
  'from-indigo-900/40 to-indigo-800/20',
]

export default function DoorSelection() {
  const chooseDoor = useStore((s) => s.chooseDoor)
  const doors = useStore((s) => s.doors)
  const [pressedDoor, setPressedDoor] = useState(null)

  const handleDoorClick = (index) => {
    chooseDoor(index)
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: 'easeIn' } }}
    >
      <div className="ambient-glow" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="text-center mb-10 relative z-10"
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Your fate is sealed.
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Pick a door.
        </p>
      </motion.div>

      <div className="flex gap-4 md:gap-6 relative z-10">
        {doors.map((_, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 40, rotateY: 180 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ 
              delay: 0.2 + index * 0.12,
              duration: 0.55,
              type: 'spring',
              stiffness: 120,
              damping: 14,
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDoorClick(index)}
            onPointerDown={() => setPressedDoor(index)}
            onPointerUp={() => setPressedDoor(null)}
            onPointerLeave={() => setPressedDoor(null)}
            className={`
              relative w-24 h-36 md:w-32 md:h-48 rounded-2xl 
              border-2 border-[var(--color-border)] 
              bg-gradient-to-b ${doorColors[index]}
              flex flex-col items-center justify-center gap-2
              cursor-pointer transition-all duration-200
              hover:border-[var(--color-accent-violet)]
              ${pressedDoor === index ? 'border-[var(--color-accent-gold)]' : ''}
            `}
            style={{ perspective: '1000px' }}
          >
            {/* Door number */}
            <span className="text-4xl md:text-5xl font-bold text-[var(--color-accent-violet-light)] opacity-40"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {index + 1}
            </span>
            
            {/* Mystery icon */}
            <span className="text-2xl">🚪</span>

            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={pressedDoor === index ? {
                boxShadow: '0 0 40px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(245, 158, 11, 0.1)'
              } : {
                boxShadow: '0 0 0px transparent'
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-xs text-[var(--color-text-muted)] relative z-10"
      >
        No going back. Choose wisely.
      </motion.p>
    </motion.div>
  )
}
