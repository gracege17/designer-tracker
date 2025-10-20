import React from 'react';
import { EmotionLevel, EMOTIONS } from '../types';

interface EmotionPickerProps {
  selectedEmotion?: EmotionLevel;
  onEmotionSelect: (emotion: EmotionLevel) => void;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  className?: string;
}

export default function EmotionPicker({
  selectedEmotion,
  onEmotionSelect,
  size = 'medium',
  showLabels = true,
  className = '',
}: EmotionPickerProps) {
  const getEmojiSize = () => {
    switch (size) {
      case 'small':
        return 'text-2xl'; // 24px
      case 'medium':
        return 'text-4xl'; // 36px
      case 'large':
        return 'text-5xl'; // 48px
      default:
        return 'text-4xl';
    }
  };

  const getContainerSize = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12';
      case 'medium':
        return 'w-16 h-16';
      case 'large':
        return 'w-20 h-20';
      default:
        return 'w-16 h-16';
    }
  };

  const emotions = Object.values(EMOTIONS);

  return (
    <div className={`${className}`}>
      {/* Emotion Selection */}
      <div className="flex justify-between items-center mb-4">
        {emotions.map((emotion) => {
          const isSelected = selectedEmotion === emotion.level;
          
          return (
            <button
              key={emotion.level}
              onClick={() => onEmotionSelect(emotion.level)}
              className={`
                ${getContainerSize()}
                rounded-full
                flex items-center justify-center
                transition-all duration-200
                hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
                ${isSelected 
                  ? 'bg-primary/20 soft-shadow border border-primary' 
                  : 'bg-white soft-shadow border border-slate-200 hover:border-primary'
                }
              `}
            >
              <span className={getEmojiSize()}>
                {emotion.emoji}
              </span>
            </button>
          );
        })}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between items-center px-1">
          {emotions.map((emotion) => {
            const isSelected = selectedEmotion === emotion.level;
            
            return (
              <span
                key={`label-${emotion.level}`}
                className={`
                  text-sm font-medium text-center
                  ${isSelected ? 'text-slate-800' : 'text-slate-500'}
                  ${size === 'small' ? 'w-12' : size === 'large' ? 'w-20' : 'w-16'}
                `}
              >
                {emotion.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Selected Emotion Display */}
      {selectedEmotion && (
        <div className="mt-6 flex items-center justify-center">
          <div className="bg-primary/10 rounded-lg px-4 py-2 soft-shadow">
            <span className="text-sm font-medium text-slate-700 text-center">
              You're feeling {EMOTIONS[selectedEmotion].label.toLowerCase()} today
            </span>
          </div>
        </div>
      )}
    </div>
  );
}




