import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  duration?: number;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ 
  message, 
  show, 
  onHide, 
  duration = 3000 
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onHide, 400); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!show && !visible) return null;

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div 
        className={`
          max-w-md w-full bg-mono-900 text-mono-50 rounded-xl p-4 
          flex items-center gap-3 shadow-xl
          ${visible ? 'success-pop' : 'opacity-0'}
          transition-opacity duration-400
        `}
      >
        <CheckCircle className="w-6 h-6 text-mono-50 flex-shrink-0" />
        <p className="font-normal text-base flex-1">{message}</p>
        <Sparkles className="w-5 h-5 text-mono-50 flex-shrink-0 animate-pulse" />
      </div>
    </div>
  );
};

// Confetti celebration component
interface ConfettiProps {
  trigger: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      // Generate random confetti particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);

      // Clear after animation completes
      setTimeout(() => setParticles([]), 1000);
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-mono-900 rounded-full confetti-burst"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Success checkmark animation component
export const SuccessCheckmark: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="inline-flex items-center justify-center success-pop">
      <div className="relative">
        <CheckCircle className="w-16 h-16 text-mono-900" strokeWidth={2} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-mono-900/10 animate-ping" />
        </div>
      </div>
    </div>
  );
};

