import React from 'react'
import { Mail, Chrome, Facebook } from 'lucide-react'
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/20 via-background-light to-background-light">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* App Icon / Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center soft-shadow">
            <span className="text-5xl">✨</span>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
          Welcome to
          <br />
          Designer's Life Tracker
        </h1>
        
        <p className="text-lg text-slate-600 text-center mb-12 max-w-md leading-relaxed">
          Sign in to start tracking your creative journey and discover what brings you joy.
        </p>

        {/* Auth Buttons */}
        <div className="w-full max-w-md space-y-4">
          {/* Google Sign In */}
          <button
            onClick={onContinueWithGoogle}
            className="w-full bg-white text-slate-900 font-semibold py-4 px-6 rounded-xl soft-shadow hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300"
          >
            <Chrome size={24} className="text-blue-600" />
            <span>Continue with Google</span>
          </button>

          {/* Facebook Sign In */}
          <button
            onClick={onContinueWithFacebook}
            className="w-full bg-[#1877F2] text-white font-semibold py-4 px-6 rounded-xl soft-shadow hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Facebook size={24} fill="white" />
            <span>Continue with Facebook</span>
          </button>

          {/* Email Sign In */}
          <button
            onClick={onContinueWithEmail}
            className="w-full bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl soft-shadow hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 hover:bg-slate-900"
          >
            <Mail size={24} />
            <span>Continue with Email</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md mt-8 mb-4">
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-slate-400">or</span>
          </div>
        </div>

        {/* Skip for now */}
        <button
          onClick={onContinueWithEmail}
          className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          Skip for now (use as guest)
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="px-6 pb-8">
        <p className="text-center text-xs text-slate-500 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br />
          <span className="font-semibold text-slate-700">Your data is encrypted and private.</span>
        </p>
      </div>
    </div>
  )
}

export default OnboardingAuth

