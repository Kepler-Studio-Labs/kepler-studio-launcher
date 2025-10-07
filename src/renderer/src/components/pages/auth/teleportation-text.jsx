import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function TeleportationText({ onComplete, text }) {
  const [particles, setParticles] = useState([])
  const [explode, setExplode] = useState(false)

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => {
      setExplode(true)
      if (onComplete) {
        setTimeout(onComplete, 1500)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="relative flex items-center justify-center">
      {explode &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-white"
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 1,
              ease: 'easeOut'
            }}
          />
        ))}

      {explode && (
        <motion.div
          className="absolute inset-0 rounded-full bg-white/30 blur-3xl"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{
            scale: 3,
            opacity: 0
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      )}

      <div className="relative flex">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            className="inline-block text-violet-400"
            initial={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0
            }}
            animate={
              explode
                ? {
                    opacity: 0,
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 300,
                    scale: 0,
                    rotate: Math.random() * 360
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              delay: index * 0.03,
              ease: 'easeOut'
            }}
          >
            {char}
            {char === ' ' && <span className="inline-block text-violet-500 w-1"> </span>}
          </motion.span>
        ))}
      </div>

      {explode &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 rounded-full border-2 border-white/50"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: 3,
              opacity: 0
            }}
            transition={{
              duration: 1,
              delay: i * 0.1,
              ease: 'easeOut'
            }}
          />
        ))}

      {explode && (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.4, times: [0, 0.2, 1] }}
        />
      )}
    </div>
  )
}
