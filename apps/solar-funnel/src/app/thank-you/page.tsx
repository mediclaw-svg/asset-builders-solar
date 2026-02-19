"use client";

import Link from "next/link";

export default function ThankYou() {
  return (
    <main className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="container mx-auto px-6">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">✓</div>
              <span className="text-sm text-gray-400">Quote Request</span>
            </div>
            <div className="flex-1 h-px bg-amber-500 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">✓</div>
              <span className="text-sm text-gray-400">Book Consultation</span>
            </div>
            <div className="flex-1 h-px bg-amber-500 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-sm">✓</div>
              <span className="text-sm text-white font-medium">Confirmed!</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4">You&apos;re All Set!</h1>
            <p className="text-gray-300 text-lg mb-8">
              Your consultation has been booked. Our solar specialist will call you at your scheduled time to review your custom savings plan.
            </p>

            <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold mb-3 text-amber-400">What happens next:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>You&apos;ll receive a confirmation email with your appointment details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Our team will analyze your property using satellite imagery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Your specialist will present a custom solar plan with exact savings numbers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>No pressure, no commitment — just the information you need to decide</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="glass px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
              >
                ← Back to Home
              </Link>
              <a
                href="tel:8187384577"
                className="gradient-cta text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
              >
                📞 Call Us: (818) 738-4577
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
