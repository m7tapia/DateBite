import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function RevealScreen() {
  const revealedRestaurant = useStore((s) => s.revealedRestaurant)
  const showAftermath = useStore((s) => s.showAftermath)

  useEffect(() => {
    const timer = setTimeout(() => {
      showAftermath()
    }, 3500)
    return () => clearTimeout(timer)
  }, [showAftermath])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="ambient-glow" />

      {/* Background burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: [0, 0.3, 0] }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-violet) 0%, transparent 60%)',
        }}
      />

      {/* Gold burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2, opacity: [0, 0.2, 0] }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-gold) 0%, transparent 60%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.3,
          duration: 0.8,
          type: 'spring',
          stiffness: 150,
          damping: 12,
        }}
        className="text-center relative z-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest mb-4"
        >
          Tonight, you're eating at
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
          className="text-5xl md:text-7xl font-extrabold mb-6"
          style={{ 
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--color-accent-violet-light) 0%, var(--color-accent-gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {revealedRestaurant}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-4xl"
        >
          🍽️
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: 0,
            x: 0,
          }}
          animate={{ 
            opacity: [0, 1, 0],
            y: -200 - Math.random() * 200,
            x: (Math.random() - 0.5) * 300,
          }}
          transition={{ 
            duration: 2 + Math.random(),
            delay: 0.5 + Math.random() * 0.5,
            ease: 'easeOut',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? 'var(--color-accent-violet)' : 'var(--color-accent-gold)',
          }}
        />
      ))}
    </div>
  )
}
