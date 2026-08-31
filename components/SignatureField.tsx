"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

export function SignatureField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const sigRef = useRef<SignatureCanvas>(null);

  function switchMode(next: "draw" | "type") {
    if (next === mode) return;
    setMode(next);
    sigRef.current?.clear();
    onChange("");
  }

  function handleStroke() {
    const pad = sigRef.current;
    if (!pad) return;
    // getTrimmedCanvas() is broken in this package's current release (throws
    // "trim_canvas is not a function" from a bad interop import), silently
    // dropping every signature. getCanvas() avoids that code path entirely -
    // the only trade-off is the untrimmed canvas keeps its blank margins.
    onChange(pad.isEmpty() ? "" : pad.getCanvas().toDataURL("image/png"));
  }

  function handleClear() {
    sigRef.current?.clear();
    onChange("");
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className={labelClass}>Signature</label>
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => switchMode("draw")}
            className={`rounded-md px-2.5 py-1 transition ${
              mode === "draw" ? "bg-white text-forest shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Draw
          </button>
          <button
            type="button"
            onClick={() => switchMode("type")}
            className={`rounded-md px-2.5 py-1 transition ${
              mode === "type" ? "bg-white text-forest shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Type name
          </button>
        </div>
      </div>

      {mode === "draw" ? (
        <div>
          <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
            <SignatureCanvas
              ref={sigRef}
              penColor="#171717"
              onEnd={handleStroke}
              canvasProps={{ className: "h-40 w-full touch-none" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-neutral-500">Sign with your mouse, stylus, or finger.</p>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-forest hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Full name"
        />
      )}
    </div>
  );
}
