import React from 'react'
import { motion } from 'framer-motion'

interface FlowerProgressProps {
  filledSteps: boolean[] // Array of 4 booleans for each petal
  className?: string
  isAnimating?: boolean
  onAnimationComplete?: () => void
}

const FlowerProgress: React.FC<FlowerProgressProps> = ({ 
  filledSteps, 
  className = '',
  isAnimating = false,
  onAnimationComplete
}) => {
  const isFullyBloomed = filledSteps.every(step => step)
  
  // Calculate target position for animation: top-right badge area
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 400
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  const targetX = (windowWidth - 100) - (windowWidth / 2) // 100px from right edge
  const targetY = 40 - (windowHeight / 2) // 40px from top

  // Define petal data based on the SVG structure
  const petals = [
    {
      // Top petal (blue-ish) - "How's your day so far?"
      path: "M11.8284 11.3138C10.2663 9.75168 10.2663 7.21902 11.8284 5.65692C14.9526 2.53273 20.0179 2.53273 23.1421 5.65692C24.7042 7.21899 24.7042 9.75171 23.1421 11.3138L17.4853 16.9706L11.8284 11.3138Z",
      gradientId: "paint0_linear",
      gradient: {
        x1: "13.2426", y1: "4.24271", x2: "21.7279", y2: "12.728",
        stops: [
          { offset: "0%", color: "#DFF0F6" },
          { offset: "100%", color: "#B7D4DA" }
        ]
      },
      label: "How's your day so far?"
    },
    {
      // Left petal (yellow-ish) - "What did you work on?"
      path: "M11.3727 23.2215C9.82715 24.8 7.29463 24.8267 5.71617 23.2811C2.55925 20.19 2.50593 15.1249 5.59706 11.968C7.14259 10.3896 9.67517 10.3629 11.2536 11.9085L16.9697 17.5054L11.3727 23.2215Z",
      gradientId: "paint3_linear",
      gradient: {
        x1: "4.28715", y1: "21.8819", x2: "12.6826", y2: "13.3077",
        stops: [
          { offset: "0%", color: "#FDF1C0" },
          { offset: "100%", color: "#EAD197" }
        ]
      },
      label: "What did you work on?"
    },
    {
      // Right petal (coral/orange) - "Task details"
      path: "M23.596 11.7492C25.1416 10.1707 27.6741 10.144 29.2526 11.6896C32.4095 14.7807 32.4628 19.8458 29.3717 23.0027C27.8262 24.5811 25.2936 24.6078 23.7152 23.0622L17.9991 17.4653L23.596 11.7492Z",
      gradientId: "paint2_linear",
      gradient: {
        x1: "30.6816", y1: "13.0889", x2: "22.2861", y2: "21.663",
        stops: [
          { offset: "0%", color: "#FDA07A" },
          { offset: "100%", color: "#EC5429" }
        ]
      },
      label: "Task details"
    },
    {
      // Bottom petal (green-ish) - "How did it make you feel?"
      path: "M23.1423 23.6569C24.7044 25.219 24.7044 27.7517 23.1423 29.3138C20.0181 32.438 14.9528 32.438 11.8286 29.3138C10.2665 27.7517 10.2665 25.219 11.8286 23.6569L17.4854 18.0001L23.1423 23.6569Z",
      gradientId: "paint1_linear",
      gradient: {
        x1: "21.7281", y1: "30.728", x2: "13.2428", y2: "22.2427",
        stops: [
          { offset: "0%", color: "#D6ECD2" },
          { offset: "100%", color: "#B8C6AD" }
        ]
      },
      label: "How did it make you feel?"
    }
  ]

  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <div className={`relative w-16 h-16 transition-all duration-500 ${isFullyBloomed ? 'scale-110' : 'scale-100'}`}>
        <motion.svg 
          width="64" 
          height="64" 
          viewBox="0 0 35 35" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-500"
          animate={isAnimating ? {
            scale: [1, 1.8, 0.6],
            x: [0, 0, targetX],
            y: [0, 0, targetY],
            opacity: [1, 1, 0],
            rotate: [0, 360, 360],
          } : {}}
          transition={{
            duration: 1.2,
            times: [0, 0.4, 1],
            ease: 'easeInOut',
          }}
          onAnimationComplete={onAnimationComplete}
        >
          <defs>
            {/* Define gradients for each petal */}
            {petals.map((petal, index) => (
              <linearGradient
                key={petal.gradientId}
                id={petal.gradientId}
                x1={petal.gradient.x1}
                y1={petal.gradient.y1}
                x2={petal.gradient.x2}
                y2={petal.gradient.y2}
                gradientUnits="userSpaceOnUse"
              >
                {petal.gradient.stops.map((stop, stopIndex) => (
                  <stop
                    key={stopIndex}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            ))}
          </defs>
          
          {/* Render each petal */}
          {petals.map((petal, index) => {
            const isFilled = filledSteps[index]
            
            return (
              <path
                key={index}
                d={petal.path}
                fill={isFilled ? `url(#${petal.gradientId})` : '#4B4B4B'}
                className="transition-all duration-500 ease-out"
                style={{
                  filter: isFilled ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none',
                  opacity: isFilled ? 1 : 0.2
                }}
              />
            )
          })}
        </motion.svg>
      </div>
    </div>
  )
}

export default FlowerProgress
