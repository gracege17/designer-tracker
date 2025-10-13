import React, { useState } from 'react'
import { User, Briefcase, Users, ArrowRight } from 'lucide-react'
import Button from './Button'
import Input from './Input'

interface OnboardingUserInfoProps {
  onComplete: (userData: UserProfileData) => void
  onBack: () => void
}

export interface UserProfileData {
  name: string
  jobTitle: string
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
}

const OnboardingUserInfo: React.FC<OnboardingUserInfoProps> = ({ onComplete, onBack }) => {
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [gender, setGender] = useState<UserProfileData['gender']>('prefer-not-to-say')
  const [errors, setErrors] = useState<{ name?: string; jobTitle?: string }>({})

  const handleContinue = () => {
    const newErrors: { name?: string; jobTitle?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Please enter your job title'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onComplete({
      name: name.trim(),
      jobTitle: jobTitle.trim(),
      gender
    })
  }

  const genderOptions = [
    { value: 'male' as const, label: 'Male', emoji: '👨' },
    { value: 'female' as const, label: 'Female', emoji: '👩' },
    { value: 'non-binary' as const, label: 'Non-binary', emoji: '🧑' },
    { value: 'prefer-not-to-say' as const, label: 'Prefer not to say', emoji: '👤' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6EB]">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 bg-[#FFD678]" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-slate-200" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-slate-200" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-slate-200" style={{ borderRadius: '0 8px 0 0' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-[#C7D1FF] flex items-center justify-center mx-auto" style={{ borderRadius: '0 16px 0 0' }}>
            <User size={32} className="text-slate-900" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-[28px] font-bold text-slate-900 mb-3 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          Tell Us About Yourself
        </h2>
        <p className="text-[16px] text-slate-700 text-center mb-8 leading-relaxed">
          This helps us personalize your experience and provide better insights.
        </p>

        {/* Form Fields */}
        <div className="space-y-6 max-w-md mx-auto">
          {/* Name Input */}
          <div>
            <Input
              label="Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors({ ...errors, name: undefined })
              }}
              placeholder="e.g., Alex Johnson"
              error={errors.name}
              autoFocus
            />
          </div>

          {/* Job Title Input */}
          <div>
            <Input
              label="Job Title"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value)
                setErrors({ ...errors, jobTitle: undefined })
              }}
              placeholder="e.g., Product Designer"
              error={errors.jobTitle}
            />
            <p className="text-xs text-slate-500 mt-1 ml-1">
              This helps us give you relevant insights
            </p>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Gender (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGender(option.value)}
                  className={`p-4 border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    gender === option.value
                      ? 'border-slate-900 bg-[#FFD678]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  style={{ borderRadius: '0 16px 0 0' }}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className={`text-sm font-medium ${
                    gender === option.value ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-1">
              Used for analytics and personalization only
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 max-w-md mx-auto bg-white p-4 border border-slate-200" style={{ borderRadius: '0 24px 0 0' }}>
          <p className="text-xs text-slate-700 text-center">
            🔒 <span className="font-semibold">Your privacy matters.</span> We use this info to improve your experience. You can update it anytime in settings.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleContinue}
          disabled={!name.trim() || !jobTitle.trim()}
          className={`w-full bg-[#000] text-white font-bold py-5 px-6 text-[17px] transition-all duration-200 flex items-center justify-center gap-2 ${
            !name.trim() || !jobTitle.trim()
              ? 'bg-[#999] cursor-not-allowed'
              : 'hover:bg-slate-900 active:scale-[0.98]'
          }`}
          style={{ borderRadius: '0 32px 0 0' }}
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
        
        <button
          onClick={onBack}
          className="w-full py-3 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default OnboardingUserInfo

