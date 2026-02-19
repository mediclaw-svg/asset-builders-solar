"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
];

export default function BookConsultation() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  }).filter((d) => d.getDay() !== 0 && d.getDay() !== 6); // Exclude weekends

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, time: selectedTime, notes }),
      });
      if (!res.ok) throw new Error("Failed to book");
      router.push("/thank-you");
    } catch (err) {
      console.error("Booking submission error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen gradient-hero">
      <div className="container mx-auto px-6 py-16">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">✓</div>
              <span className="text-sm text-gray-400">Quote Request</span>
            </div>
            <div className="flex-1 h-px bg-amber-500 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">2</div>
              <span className="text-sm text-white font-medium">Book Consultation</span>
            </div>
            <div className="flex-1 h-px bg-white/20 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-500 font-bold text-sm">3</div>
              <span className="text-sm text-gray-500">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">Book Your Free Consultation</h1>
            <p className="text-gray-400 text-lg">
              Choose a time that works for you. Our solar specialist will call you to review your custom savings plan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
              <div className="grid grid-cols-5 gap-3">
                {dates.map((d) => {
                  const dateStr = d.toISOString().split("T")[0];
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        isSelected
                          ? "bg-amber-500 text-black"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-xs uppercase">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-lg font-bold">{d.getDate()}</div>
                      <div className="text-xs">
                        {d.toLocaleDateString("en-US", { month: "short" })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Select a Time (PST)</h3>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl text-center transition-all ${
                        selectedTime === time
                          ? "bg-amber-500 text-black font-bold"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedTime && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Anything else we should know? (optional)</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g., I'm interested in battery storage too, my roof was replaced 2 years ago..."
                />
              </div>
            )}

            {/* Submit */}
            {selectedTime && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full gradient-cta text-black font-bold py-4 rounded-xl text-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {submitting
                  ? "Booking..."
                  : `Confirm: ${new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })} at ${selectedTime}`}
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
