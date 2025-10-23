import React from 'react'
import { motion } from 'framer-motion'

interface FlowerMeteorAnimationProps {
  isAnimating: boolean
  onAnimationComplete: () => void
  taskCount: number
  projectTitle: string
}

const FlowerMeteorAnimation: React.FC<FlowerMeteorAnimationProps> = ({
  isAnimating,
  onAnimationComplete,
}) => {
  // Don't render if not animating
  if (!isAnimating) {
    return null
  }

  // Calculate target position: distance from center to badge location
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 400
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  
  // Badge is approximately at top-right: 100px from right, 30-40px from top
  const badgeX = windowWidth - 100 // Badge X position
  const badgeY = 40 // Badge Y position from top
  
  // Calculate distance from center of screen to badge
  const centerX = windowWidth / 2
  const centerY = windowHeight / 2
  const targetX = badgeX - centerX
  const targetY = badgeY - centerY

  return (
    <>
      {/* Animated Flower SVG - starts from center of screen */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 35 35"
        className="fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none"
        initial={{
          scale: 1,
          rotate: 0,
          x: 0,
          y: 0,
          opacity: 1,
        }}
        animate={{
          scale: [1, 1.8, 0.6, 0.6],     // 先放大再缩小，后保持
          rotate: [0, 0, 360, 360],      // 中心旋转
          x: [0, 0, 0, targetX],         // 前面停留在中心，最后移动
          y: [0, 0, 0, targetY],
          opacity: [1, 1, 1, 0],         // 最后再消失
        }}
        transition={{
          duration: 1.8,
          times: [0, 0.3, 0.5, 1],       // 前 30% 放大，50% 缩小，后 50% 移动 + 消失
          ease: "easeInOut",
        }}
        onAnimationComplete={onAnimationComplete}
      >
        <defs>
          <linearGradient id="anim-paint0" x1="13.2426" y1="4.24271" x2="21.7279" y2="12.728" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFF0F6"/>
            <stop offset="1" stopColor="#B7D4DA"/>
          </linearGradient>
          <linearGradient id="anim-paint1" x1="21.7281" y1="30.728" x2="13.2428" y2="22.2427" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D6ECD2"/>
            <stop offset="1" stopColor="#B8C6AD"/>
          </linearGradient>
          <linearGradient id="anim-paint2" x1="30.6816" y1="13.0889" x2="22.2861" y2="21.663" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDA07A"/>
            <stop offset="1" stopColor="#EC5429"/>
          </linearGradient>
          <linearGradient id="anim-paint3" x1="4.28715" y1="21.8819" x2="12.6826" y2="13.3077" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDF1C0"/>
            <stop offset="1" stopColor="#EAD197"/>
          </linearGradient>
          
          {/* Motion blur effect for trail */}
          <filter id="motionBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
        </defs>
        
        {/* Top petal (blue) */}
        <path d="M11.8284 11.3138C10.2663 9.75168 10.2663 7.21902 11.8284 5.65692C14.9526 2.53273 20.0179 2.53273 23.1421 5.65692C24.7042 7.21899 24.7042 9.75171 23.1421 11.3138L17.4853 16.9706L11.8284 11.3138Z" fill="url(#anim-paint0)"/>
        
        {/* Left petal (yellow) */}
        <path d="M11.3727 23.2215C9.82715 24.8 7.29463 24.8267 5.71617 23.2811C2.55925 20.19 2.50593 15.1249 5.59706 11.968C7.14259 10.3896 9.67517 10.3629 11.2536 11.9085L16.9697 17.5054L11.3727 23.2215Z" fill="url(#anim-paint3)"/>
        
        {/* Right petal (coral) */}
        <path d="M23.596 11.7492C25.1416 10.1707 27.6741 10.144 29.2526 11.6896C32.4095 14.7807 32.4628 19.8458 29.3717 23.0027C27.8262 24.5811 25.2936 24.6078 23.7152 23.0622L17.9991 17.4653L23.596 11.7492Z" fill="url(#anim-paint2)"/>
        
        {/* Bottom petal (green) */}
        <path d="M23.1423 23.6569C24.7044 25.219 24.7044 27.7517 23.1423 29.3138C20.0181 32.438 14.9528 32.438 11.8286 29.3138C10.2665 27.7517 10.2665 25.219 11.8286 23.6569L17.4854 18.0001L23.1423 23.6569Z" fill="url(#anim-paint1)"/>
      </motion.svg>

      {/* Trail effect - subtle glow that follows */}
      <motion.div
        className="fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-[9998] pointer-events-none"
        initial={{
          scale: 1,
          x: 0,
          y: 0,
          opacity: 0,
        }}
        animate={{
          scale: [1, 2, 1],
          x: [0, 0, targetX],
          y: [0, 0, targetY],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 1.2,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-200 via-orange-200 to-green-200 blur-md" />
      </motion.div>
    </>
  )
}

export default FlowerMeteorAnimation
