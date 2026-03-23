import { useState } from "react";
import { submitRecord } from "../lib/airtable";

const INITIAL = {
  fullName: "",
  phone: "",
  location: "",
  customerType: "",
  wasteType: "",
  wasteQuantity: "",
  frequency: "",
  referralSource: "",
};

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-700">
        {label} {required && <span className="text-brand-orange">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = `w-full px-3.5 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200
   rounded-xl outline-none focus:bg-white focus:border-brand-blue
   focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-gray-300`;

const selectCls = `${inputCls} appearance-none cursor-pointer
   bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")]
   bg-no-repeat bg-[right_12px_center] pr-10`;

const quantityOptions = [
  { label: "Small", sub: "1–2 bags" },
  { label: "Medium", sub: "3–5 bags" },
  { label: "Large", sub: "5+ bags" },
];

export default function WaitlistForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    if (!form.fullName) return "Please enter your full name.";
    if (!form.phone) return "Please enter your WhatsApp number.";
    if (!form.location) return "Please enter your location / area.";
    if (!form.customerType) return "Please select your customer type.";
    if (!form.wasteType) return "Please select a type of waste.";
    if (!form.frequency) return "Please select a pickup frequency.";
    if (!form.wasteQuantity)
      return "Please select your estimated waste quantity.";
    if (!form.referralSource)
      return "Please tell us how you heard about TrashGo.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await submitRecord(form);
      setDone(true);
      onSuccess();
    } catch (ex) {
      setError(ex.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── SUCCESS ─────────────────────────────────────────────── */
  if (done) {
    return (
      <div className="text-center py-10 px-2">
        <div
          className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200
                        flex items-center justify-center text-3xl mx-auto mb-5"
        >
          ✅
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">
          You're on the list!
        </h3>

        {/* WhatsApp notification callout */}
        <div className="w-full bg-[#f0fdf4] border border-green-200 rounded-xl px-4 py-3.5 mb-5 text-left flex gap-3">
          <span className="text-xl shrink-0">💬</span>
          <div>
            <p className="text-sm font-semibold text-green-800">
              Check your WhatsApp!
            </p>
            <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
              We've sent you a welcome message on WhatsApp with more details
              about TrashGo, how the pilot works, and when we'll be in your
              area.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Our team will contact you personally when the free waste pickup pilot
          begins in your area.
        </p>
      </div>
    );
  }

  /* ── FORM ────────────────────────────────────────────────── */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 mt-1"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <input
            type="text"
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="e.g. Mohamed Kamara"
            className={inputCls}
          />
        </Field>
        <Field label="WhatsApp Number" required>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+232 76 123456"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Location / Area" required>
          <input
            type="text"
            value={form.location}
            onChange={set("location")}
            placeholder="e.g. Freetown, Murray Town"
            className={inputCls}
          />
        </Field>
        <Field label="Customer Type" required>
          <select
            value={form.customerType}
            onChange={set("customerType")}
            className={selectCls}
          >
            <option value="" disabled>
              Select type
            </option>
            <option>Household</option>
            <option>Business / Shop</option>
            <option>Restaurant / Food Vendor</option>
            <option>School</option>
            <option>Office / Organization</option>
          </select>
        </Field>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Type of Waste" required>
          <select
            value={form.wasteType}
            onChange={set("wasteType")}
            className={selectCls}
          >
            <option value="" disabled>
              Select waste type
            </option>
            <option>Household waste</option>
            <option>Plastic waste</option>
            <option>Paper / Cardboard</option>
            <option>Food waste</option>
            <option>Mixed waste</option>
          </select>
        </Field>
        <Field label="Pickup Frequency" required>
          <select
            value={form.frequency}
            onChange={set("frequency")}
            className={selectCls}
          >
            <option value="" disabled>
              How often?
            </option>
            <option>Once per week</option>
            <option>Twice per week</option>
            <option>Every two weeks</option>
            <option>Not sure yet</option>
          </select>
        </Field>
      </div>

      {/* Waste Quantity */}
      <Field label="Estimated Waste Quantity" required>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-0.5">
          {quantityOptions.map(({ label, sub }) => {
            const val = `${label} (${sub})`;
            const active = form.wasteQuantity === val;
            return (
              <label
                key={val}
                className={`flex flex-col items-center justify-center gap-0.5
                            py-3 px-1 rounded-xl border-2 cursor-pointer select-none
                            transition-all text-center
                            ${
                              active
                                ? "border-brand-blue bg-brand-blue-light text-brand-blue"
                                : "border-gray-200 bg-gray-50 text-gray-500 hover:border-brand-blue/40"
                            }`}
              >
                <input
                  type="radio"
                  name="wasteQuantity"
                  value={val}
                  checked={active}
                  onChange={set("wasteQuantity")}
                  className="sr-only"
                />
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    active ? "text-brand-blue" : "text-gray-700"
                  }`}
                >
                  {label}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {sub}
                </span>
              </label>
            );
          })}
        </div>
      </Field>

      {/* Referral */}
      <Field label="How did you hear about TrashGo?" required>
        <select
          value={form.referralSource}
          onChange={set("referralSource")}
          className={selectCls}
        >
          <option value="" disabled>
            Select option
          </option>
          <option>WhatsApp</option>
          <option>Facebook</option>
          <option>Friend / Referral</option>
          <option>Flyer</option>
          <option>Other</option>
        </select>
      </Field>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-2 bg-red-50 border border-red-100
                        text-red-600 rounded-xl px-4 py-3 text-sm"
        >
          <span className="shrink-0">⚠️</span>
          {error}
        </div>
      )}

      <div className="border-t border-gray-100 pt-1" />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-brand-blue text-white font-bold text-[15px] rounded-xl
                   shadow-[0_4px_16px_rgba(26,80,214,0.3)]
                   hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all active:scale-[.98] flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
              viewBox="0 0 24 24"
            />
            Submitting…
          </>
        ) : (
          "Join TrashGo Early Access ✓"
        )}
      </button>

      <p className="text-center text-xs text-gray-400 pb-1">
        Free to join · No spam · We'll only contact you about TrashGo
      </p>
    </form>
  );
}
