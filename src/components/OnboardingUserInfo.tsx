import React, { useState } from 'react'
import { User, Briefcase, Users, CaretRight } from 'phosphor-react'
import Button from './Button'
import Input from './Input'

interface OnboardingUserInfoProps {
  onComplete: (userData: UserProfileData) => void
}

export interface UserProfileData {
  name: string
  jobTitle: string
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
  ageRange: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+'
}

const OnboardingUserInfo: React.FC<OnboardingUserInfoProps> = ({ onComplete }) => {
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [gender, setGender] = useState<UserProfileData['gender']>('prefer-not-to-say')
  const [ageRange, setAgeRange] = useState<UserProfileData['ageRange']>('25-34')
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
      gender,
      ageRange
    })
  }

  const genderOptions = [
    { value: 'male' as const, label: 'Male', emoji: '👨' },
    { value: 'female' as const, label: 'Female', emoji: '👩' },
    { value: 'non-binary' as const, label: 'Non-binary', emoji: '🧑' },
    { value: 'prefer-not-to-say' as const, label: 'Prefer not to say', emoji: '👤' }
  ]

  const ageRangeOptions = [
    { value: '18-24' as const, label: '18-24' },
    { value: '25-34' as const, label: '25-34' },
    { value: '35-44' as const, label: '35-44' },
    { value: '45-54' as const, label: '45-54' },
    { value: '55-64' as const, label: '55-64' },
    { value: '65+' as const, label: '65+' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
          <div className="h-2 flex-1 rounded-full bg-white/10"></div>
          <div className="h-2 flex-1 rounded-full bg-white/10"></div>
          <div className="h-2 flex-1 rounded-full bg-white/10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-[rgba(175,82,222,0.2)] flex items-center justify-center mx-auto" style={{ borderRadius: '0 16px 0 0' }}>
            <User size={32} weight="regular" className="text-[#E0B3FF]" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-[28px] font-bold text-[var(--md-sys-color-on-surface)] mb-3 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          A bit about you
        </h2>
        <p className="text-[16px] text-[var(--md-sys-color-on-surface-variant)] text-center mb-8 leading-relaxed">
          This helps us give you better insights.
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
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1 ml-1">
              This helps give you relevant insights.
            </p>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--md-sys-color-on-surface-variant)] mb-3">
              Gender (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGender(option.value)}
                  className={`p-4 border transition-all duration-200 flex flex-col items-center gap-2 rounded-xl backdrop-blur-sm ${
                    gender === option.value
                      ? 'border-[var(--md-sys-color-primary)] bg-[rgba(236,84,41,0.18)] shadow-[0_12px_30px_rgba(236,84,41,0.25)]'
                      : 'border-white/10 bg-[var(--md-sys-color-surface-container)] hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className={`text-sm font-medium ${
                    gender === option.value ? 'text-[var(--md-sys-color-on-surface)]' : 'text-[var(--md-sys-color-on-surface-variant)]'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-2 ml-1">
              Used for analytics and personalization only
            </p>
          </div>

          {/* Age Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--md-sys-color-on-surface-variant)] mb-3 ml-1">
              Age Range
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ageRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAgeRange(option.value)}
                  className={`p-3 border transition-all duration-200 flex items-center justify-center rounded-xl ${
                    ageRange === option.value
                      ? 'border-[var(--md-sys-color-primary)] bg-[rgba(236,84,41,0.18)] shadow-[0_8px_24px_rgba(236,84,41,0.2)]'
                      : 'border-white/10 bg-[var(--md-sys-color-surface-container)] hover:border-white/20'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    ageRange === option.value ? 'text-[var(--md-sys-color-on-surface)]' : 'text-[var(--md-sys-color-on-surface-variant)]'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 max-w-md mx-auto bg-[var(--md-sys-color-surface-container-high)] p-4 border border-white/10" style={{ borderRadius: '0 24px 0 0' }}>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] text-center">
            🔒 <span className="font-semibold text-[var(--md-sys-color-on-surface)]">Your privacy matters.</span> Everything stays on your device. You can update this anytime in settings.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleContinue}
          disabled={!name.trim() || !jobTitle.trim()}
          className={`w-full font-semibold py-3 px-4 text-[17px] transition-all duration-200 flex items-center justify-center gap-2 rounded-2xl ${
            !name.trim() || !jobTitle.trim()
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-[0_18px_44px_rgba(236,84,41,0.4)] hover:bg-[var(--md-sys-color-primary-hover)] active:scale-[0.98]'
          }`}
        >
          <span>Continue</span>
          <CaretRight size={20} weight="bold" />
        </button>
      </div>
    </div>
  )
}

export default OnboardingUserInfo

