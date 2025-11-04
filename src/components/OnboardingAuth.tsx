import React from 'react'
import { EnvelopeSimple, GoogleChromeLogo, FacebookLogo } from 'phosphor-react'
import Button from './Button'

interface OnboardingAuthProps {
  onContinueWithGoogle: () => void
  onContinueWithFacebook: () => void
  onContinueWithEmail: () => void
}

const OnboardingAuth: React.FC<OnboardingAuthProps> = ({
  onContinueWithGoogle,
  onContinueWithFacebook,
  onContinueWithEmail
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* App Icon / Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-[var(--md-sys-color-surface-container-high)] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <img 
              src="/images/designer's logo.svg" 
              alt="Designer's Life Tracker Logo" 
              className="w-16 h-16"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-[32px] font-bold mb-4 text-center leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          Welcome to
          <br />
          Designer's Life Tracker
        </h1>
        
        <p className="text-[16px] text-[var(--md-sys-color-on-surface-variant)] text-center mb-12 max-w-md leading-relaxed">
          Track your creative work and discover what brings you joy.
        </p>

        {/* Auth Buttons */}
        <div className="w-full max-w-md space-y-4">
          {/* Google Sign In */}
          <button
            onClick={onContinueWithGoogle}
            className="w-full bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] font-medium py-5 px-6 transition-all duration-200 flex items-center justify-center gap-3 border border-[var(--md-sys-color-outline)] rounded-2xl hover:bg-[var(--md-sys-color-surface-container)] active:scale-[0.98]"
          >
            <GoogleChromeLogo size={24} weight="regular" className="text-[#A8C7FA]" />
            <span>Continue with Google</span>
          </button>

          {/* Facebook Sign In */}
          <button
            onClick={onContinueWithFacebook}
            className="w-full bg-[#1877F2] text-white font-medium py-5 px-6 transition-all duration-200 flex items-center justify-center gap-3 rounded-2xl shadow-[0_12px_30px_rgba(24,119,242,0.35)] hover:bg-[#1565D8] active:scale-[0.98]"
          >
            <FacebookLogo size={24} weight="fill" className="text-white" />
            <span>Continue with Facebook</span>
          </button>

          {/* Email Sign In */}
          <button
            onClick={onContinueWithEmail}
            className="w-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-medium py-5 px-6 transition-all duration-200 flex items-center justify-center gap-3 rounded-2xl shadow-[0_16px_40px_rgba(236,84,41,0.45)] hover:bg-[var(--md-sys-color-primary-hover)] active:scale-[0.98]"
          >
            <EnvelopeSimple size={24} weight="regular" />
            <span>Continue with Email</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md mt-8 mb-4">
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-white/30">or</span>
          </div>
        </div>

        {/* Skip for now */}
        <button
          onClick={onContinueWithEmail}
          className="text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] font-medium transition-colors"
        >
          Skip for now (use as guest)
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="px-6 pb-8">
        <p className="text-center text-xs text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
          By continuing, you agree to our Terms & Privacy Policy.
          <br />
          <span className="font-semibold text-[var(--md-sys-color-on-surface)]">Your data is encrypted and private.</span>
        </p>
      </div>
    </div>
  )
}

export default OnboardingAuth

