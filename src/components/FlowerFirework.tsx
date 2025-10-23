import React from 'react'
import { motion } from 'framer-motion'

interface FlowerFireworkProps {
  isActive: boolean
  onComplete?: () => void
}

const FlowerFirework: React.FC<FlowerFireworkProps> = ({ isActive, onComplete }) => {
  if (!isActive) return null

  // Generate 8 flowers with random directions
  const flowerCount = 8
  const flowers = Array.from({ length: flowerCount }, (_, i) => {
    const angle = (i / flowerCount) * Math.PI * 2 // Evenly distributed angles
    const distance = 200 + Math.random() * 100 // Random distance 200-300px
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    const rotation = Math.random() * 720 - 360 // Random rotation -360 to 360
    const delay = Math.random() * 0.1 // Slight random delay for more organic feel
    
    return { x, y, rotation, delay, id: i }
  })

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] flex items-center justify-center">
      {flowers.map((flower) => (
        <motion.svg
          key={flower.id}
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 35 35"
          className="absolute"
          initial={{
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            scale: [0, 1.5, 1],
            x: flower.x,
            y: flower.y,
            opacity: [1, 1, 0],
            rotate: flower.rotation,
          }}
          transition={{
            duration: 1,
            delay: flower.delay,
            ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
          }}
          onAnimationComplete={() => {
            if (flower.id === flowers.length - 1) {
              onComplete?.()
            }
          }}
        >
          <defs>
            <linearGradient id={`fw-paint0-${flower.id}`} x1="13.2426" y1="4.24271" x2="21.7279" y2="12.728" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DFF0F6"/>
              <stop offset="1" stopColor="#B7D4DA"/>
            </linearGradient>
            <linearGradient id={`fw-paint1-${flower.id}`} x1="21.7281" y1="30.728" x2="13.2428" y2="22.2427" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D6ECD2"/>
              <stop offset="1" stopColor="#B8C6AD"/>
            </linearGradient>
            <linearGradient id={`fw-paint2-${flower.id}`} x1="30.6816" y1="13.0889" x2="22.2861" y2="21.663" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDA07A"/>
              <stop offset="1" stopColor="#EC5429"/>
            </linearGradient>
            <linearGradient id={`fw-paint3-${flower.id}`} x1="4.28715" y1="21.8819" x2="12.6826" y2="13.3077" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDF1C0"/>
              <stop offset="1" stopColor="#EAD197"/>
            </linearGradient>
          </defs>
          
          {/* Top petal (blue) */}
          <path d="M11.8284 11.3138C10.2663 9.75168 10.2663 7.21902 11.8284 5.65692C14.9526 2.53273 20.0179 2.53273 23.1421 5.65692C24.7042 7.21899 24.7042 9.75171 23.1421 11.3138L17.4853 16.9706L11.8284 11.3138Z" fill={`url(#fw-paint0-${flower.id})`}/>
          
          {/* Left petal (yellow) */}
          <path d="M11.3727 23.2215C9.82715 24.8 7.29463 24.8267 5.71617 23.2811C2.55925 20.19 2.50593 15.1249 5.59706 11.968C7.14259 10.3896 9.67517 10.3629 11.2536 11.9085L16.9697 17.5054L11.3727 23.2215Z" fill={`url(#fw-paint3-${flower.id})`}/>
          
          {/* Right petal (coral) */}
          <path d="M23.596 11.7492C25.1416 10.1707 27.6741 10.144 29.2526 11.6896C32.4095 14.7807 32.4628 19.8458 29.3717 23.0027C27.8262 24.5811 25.2936 24.6078 23.7152 23.0622L17.9991 17.4653L23.596 11.7492Z" fill={`url(#fw-paint2-${flower.id})`}/>
          
          {/* Bottom petal (green) */}
          <path d="M23.1423 23.6569C24.7044 25.219 24.7044 27.7517 23.1423 29.3138C20.0181 32.438 14.9528 32.438 11.8286 29.3138C10.2665 27.7517 10.2665 25.219 11.8286 23.6569L17.4854 18.0001L23.1423 23.6569Z" fill={`url(#fw-paint1-${flower.id})`}/>
        </motion.svg>
      ))}
    </div>
  )
}

export default FlowerFirework

