"use client";

export default function StarsInput({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((estrella) => (
        <button
          key={estrella}
          type="button"
          onClick={() => onChange(estrella)}
          className={`rounded-lg px-3 py-2 text-lg transition ${
            estrella <= value
              ? "bg-primary text-white"
              : "border border-black/10 bg-background text-primary"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
