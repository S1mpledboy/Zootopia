"use client";
import { useState } from "react";

export default function AdoptForm({ petId, petName }: { petId: string; petName: string }) {
  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/adopt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId, ...form }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Zgłoszenie wysłane!</h3>
        <p className="text-green-700 text-sm">
          Dziękujemy za zainteresowanie adopcją <strong>{petName}</strong>!
          Schronisko skontaktuje się z Tobą wkrótce.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { name: "applicantName", label: "Imię i nazwisko", type: "text", placeholder: "Jan Kowalski" },
        { name: "applicantEmail", label: "E-mail", type: "email", placeholder: "jan@przykład.pl" },
        { name: "applicantPhone", label: "Telefon", type: "tel", placeholder: "+48 600 000 000" },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{label} *</label>
          <input
            name={name}
            type={type}
            value={(form as any)[name]}
            onChange={handleChange}
            required
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d8b3d] focus:border-transparent"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Dlaczego chcesz adoptować {petName}?
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Powiedz nam trochę o sobie i swoim domu..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d8b3d] focus:border-transparent resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm">Coś poszło nie tak. Zadzwoń do schroniska.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#3d8b3d] hover:bg-[#2d6a2d] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
      >
        {status === "sending" ? "Wysyłanie..." : `Chcę adoptować ${petName} 🐾`}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Schronisko skontaktuje się z Tobą w ciągu 2–3 dni roboczych.
      </p>
    </form>
  );
}