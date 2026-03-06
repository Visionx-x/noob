'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-fintech">
      <div className="container-mobile py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Link>
          
          <h1 className="text-headline text-white mb-4">Privacy Policy</h1>
          <p className="text-body text-white/70">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Introduction</h2>
            <p className="text-body text-white/80 mb-4">
              GrowthForge ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our habit tracking mobile application.
            </p>
            <p className="text-body text-white/80">
              By using GrowthForge, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Information We Collect</h2>
            
            <h3 className="text-subtitle text-white mb-3">Personal Information</h3>
            <ul className="text-body text-white/80 space-y-2 mb-4">
              <li>• Email address (for account creation and authentication)</li>
              <li>• Username (display name, can be customized)</li>
              <li>• Password (encrypted and securely stored)</li>
            </ul>

            <h3 className="text-subtitle text-white mb-3">Usage Data</h3>
            <ul className="text-body text-white/80 space-y-2 mb-4">
              <li>• Habit creation and completion data</li>
              <li>• Streak information and progress tracking</li>
              <li>• Achievement unlocks and XP earned</li>
              <li>• Analytics data (app usage patterns, crash reports)</li>
            </ul>

            <h3 className="text-subtitle text-white mb-3">Device Information</h3>
            <ul className="text-body text-white/80 space-y-2">
              <li>• Device type and operating system</li>
              <li>• Unique device identifier (for analytics)</li>
              <li>• IP address (for security purposes)</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">How We Use Your Information</h2>
            <ul className="text-body text-white/80 space-y-2">
              <li>• To provide and maintain the habit tracking service</li>
              <li>• To personalize your experience and track progress</li>
              <li>• To send notifications and reminders (with your consent)</li>
              <li>• To analyze app usage and improve our services</li>
              <li>• To ensure security and prevent fraud</li>
              <li>• To comply with legal obligations</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Data Sharing and Disclosure</h2>
            <p className="text-body text-white/80 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
            </p>
            <ul className="text-body text-white/80 space-y-2">
              <li>• With service providers who assist in operating our app</li>
              <li>• When required by law or to protect our rights</li>
              <li>• In connection with a business transfer (merger, acquisition)</li>
              <li>• With your explicit consent</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Data Security</h2>
            <p className="text-body text-white/80 mb-4">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="text-body text-white/80 space-y-2">
              <li>• Passwords are encrypted using industry-standard algorithms</li>
              <li>• Data transmission uses HTTPS encryption</li>
              <li>• Regular security audits and updates</li>
              <li>• Limited access to personal data</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Your Rights</h2>
            <p className="text-body text-white/80 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="text-body text-white/80 space-y-2">
              <li>• Access to your personal data</li>
              <li>• Correction of inaccurate information</li>
              <li>• Deletion of your account and data</li>
              <li>• Restriction of processing</li>
              <li>• Data portability</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Children's Privacy</h2>
            <p className="text-body text-white/80">
              GrowthForge is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Changes to This Policy</h2>
            <p className="text-body text-white/80">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-title text-white mb-4">Contact Us</h2>
            <p className="text-body text-white/80 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="text-body text-white/80 space-y-2">
              <p>• Email: privacy@growthforge.app</p>
              <p>• Website: www.growthforge.app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
