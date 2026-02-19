"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const services = [
  {
    icon: "☀️",
    title: "Solar Panel Installation",
    desc: "Custom-designed solar systems that maximize your energy production and savings.",
  },
  {
    icon: "🔋",
    title: "Battery Storage Systems",
    desc: "Store excess energy for use when you need it most. Never worry about outages again.",
  },
  {
    icon: "💰",
    title: "Solar Financing & Incentives",
    desc: "Expert guidance on tax credits, rebates, and financing options to minimize your costs.",
  },
  {
    icon: "📊",
    title: "System Monitoring & Maintenance",
    desc: "24/7 monitoring and proactive maintenance to keep your system running at peak efficiency.",
  },
];

const stats = [
  { value: "500+", label: "Installations" },
  { value: "$2.4M", label: "Customer Savings" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "25yr", label: "Warranty" },
];

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    electricBill: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      router.push("/book");
    } catch (err) {
      console.error("Lead submission error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex items-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">
                  Now Serving Los Angeles & Surrounding Areas
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Power Your Home.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Save Thousands.
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Join hundreds of homeowners who switched to solar with Asset
                Builders AI. Get a free consultation and see how much you can
                save.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#get-quote"
                  className="gradient-cta text-black font-bold px-8 py-4 rounded-xl text-lg hover:scale-105 transition-transform"
                >
                  Get Your Free Quote →
                </a>
                <button
                  onClick={() => setShowChat(true)}
                  className="glass px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/10 transition-colors"
                >
                  💬 Talk to Our AI Expert
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mt-12">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold text-amber-400">
                      {s.value}
                    </div>
                    <div className="text-sm text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Lead Capture Form */}
            <div id="get-quote" className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-2">
                Get Your Free Solar Quote
              </h2>
              <p className="text-gray-400 mb-6">
                Fill out the form and we&apos;ll prepare a custom savings
                estimate for your home.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="john@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="(818) 555-0123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Property Address
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="123 Main St, Los Angeles, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Average Monthly Electric Bill
                  </label>
                  <select
                    required
                    value={form.electricBill}
                    onChange={(e) =>
                      setForm({ ...form, electricBill: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="" className="bg-gray-900">
                      Select range...
                    </option>
                    <option value="0-100" className="bg-gray-900">
                      $0 - $100
                    </option>
                    <option value="100-200" className="bg-gray-900">
                      $100 - $200
                    </option>
                    <option value="200-300" className="bg-gray-900">
                      $200 - $300
                    </option>
                    <option value="300-500" className="bg-gray-900">
                      $300 - $500
                    </option>
                    <option value="500+" className="bg-gray-900">
                      $500+
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full gradient-cta text-black font-bold py-4 rounded-xl text-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Get My Free Quote →"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  No commitment required. We&apos;ll never share your
                  information.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Solar Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From installation to long-term monitoring, we handle everything so
              you can enjoy clean, affordable energy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:animate-float">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Get Your Free Quote",
                desc: "Fill out our form or chat with our AI expert. We'll analyze your energy usage and property.",
              },
              {
                step: "02",
                title: "Book a Consultation",
                desc: "Schedule a call with our solar specialists to review your custom plan and savings estimate.",
              },
              {
                step: "03",
                title: "Go Solar",
                desc: "We handle permits, installation, and monitoring. Start saving from day one.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            The average homeowner saves $1,500/year with solar. Find out what
            you could save.
          </p>
          <a
            href="#get-quote"
            className="inline-block gradient-cta text-black font-bold px-10 py-4 rounded-xl text-lg hover:scale-105 transition-transform"
          >
            Get Your Free Quote →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © 2026 Asset Builders AI Solar. All rights reserved.
          </div>
          <div className="text-gray-500 text-sm">
            23559 Friar St, Woodland Hills, CA 91367 · (818) 738-4577
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] glass rounded-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="font-bold">Solar AI Expert</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-white/5 rounded-lg p-3 mb-3 max-w-[80%]">
              <p className="text-sm">
                Hey! 👋 I&apos;m the Asset Builders AI solar expert. I can help
                you understand your solar options, estimate savings, and book a
                consultation. What would you like to know?
              </p>
            </div>
          </div>
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about solar..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button className="gradient-cta text-black font-bold px-4 py-2 rounded-lg text-sm">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat FAB */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 gradient-cta rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-transform z-50"
        >
          💬
        </button>
      )}
    </main>
  );
}
