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
    <div className="min-h-screen flex flex-col bg-background-light">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
          <div className="h-2 flex-1 rounded-full bg-slate-200"></div>
          <div className="h-2 flex-1 rounded-full bg-slate-200"></div>
          <div className="h-2 flex-1 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
            <User size={32} className="text-blue-600" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
          Tell Us About Yourself
        </h2>
        <p className="text-slate-600 text-center mb-8 leading-relaxed">
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
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    gender === option.value
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
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
        <div className="mt-8 max-w-md mx-auto bg-blue-50 rounded-xl p-4 border border-blue-100">
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
          className={`w-full bg-primary text-slate-900 font-bold py-4 px-6 rounded-xl text-lg soft-shadow transition-all duration-200 ease-out flex items-center justify-center gap-2 ${
            !name.trim() || !jobTitle.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90 hover:scale-[0.98] active:scale-95'
          }`}
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

