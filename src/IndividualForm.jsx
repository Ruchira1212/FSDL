import { useState } from "react";
import "./IndividualForm.css";

const REQUIRED_FIELDS = ["firstName", "lastName", "dob", "gender", "email", "phone", "country"];

const ERROR_LABELS = {
  firstName: "First name is required",
  lastName: "Last name is required",
  dob: "Date of birth is required",
  gender: "Please select a gender",
  email: "Email address is required",
  phone: "Phone number is required",
  country: "Please select a country",
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const validatePhone = (phone) => /^[\d\s+\-()]{7,15}$/.test(phone);

const initialState = {
  firstName: "", lastName: "", dob: "", gender: "",
  email: "", phone: "", country: "",
  occupation: "", company: "", bio: "",
};

export default function IndividualForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }

  const filledCount = REQUIRED_FIELDS.filter((id) => form[id].trim()).length;
  const progress = Math.round((filledCount / REQUIRED_FIELDS.length) * 100);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
    const v = value.trim();
    if (id === "email" && v && !validateEmail(v)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address (e.g. name@domain.com)" }));
    }
    if (id === "phone" && v && !validatePhone(v)) {
      setErrors((prev) => ({ ...prev, phone: "Enter a valid phone number (digits, spaces, + allowed)" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach((id) => {
      if (!form[id].trim()) newErrors[id] = ERROR_LABELS[id];
    });
    if (form.email.trim() && !validateEmail(form.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. name@domain.com)";
    }
    if (form.phone.trim() && !validatePhone(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (digits, spaces, + allowed)";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    setToast(null);
    const newErrors = validate();
    const allTouched = {};
    REQUIRED_FIELDS.forEach((id) => (allTouched[id] = true));
    setTouched(allTouched);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ type: "error", message: "Please fix the errors below and try again." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setToast({
        type: "success",
        message: `Welcome, ${form.firstName} ${form.lastName}! Your profile (ID: ${data.id}) has been saved.`,
      });
    } catch {
      setToast({ type: "error", message: "Submission failed. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    setTouched({});
    setToast(null);
  };

  const fieldClass = (id) => {
    if (errors[id]) return "input error";
    if (touched[id] && form[id].trim()) return "input valid";
    return "input";
  };

  return (
    <div className="page">
      <div className="form-header">
        <h1>Individual profile</h1>
        <p>Fill in your details below. Fields marked <span className="req">*</span> are required.</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? (
              <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
                <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#EAF3DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
                <line x1="2" y1="2" x2="8" y2="8" stroke="#FCEBEB" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="8" y1="2" x2="2" y2="8" stroke="#FCEBEB" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="toast-body">
            <div className="toast-title">{toast.type === "success" ? "Submission successful" : "Submission failed"}</div>
            <div className="toast-sub">{toast.message}</div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="section-title">Personal information</div>

        <div className="grid-2">
          <Field id="firstName" label="First name" required error={errors.firstName}>
            <input id="firstName" className={fieldClass("firstName")} type="text" placeholder="e.g. Priya" value={form.firstName} onChange={handleChange} onBlur={handleBlur} autoComplete="given-name" />
          </Field>
          <Field id="lastName" label="Last name" required error={errors.lastName}>
            <input id="lastName" className={fieldClass("lastName")} type="text" placeholder="e.g. Sharma" value={form.lastName} onChange={handleChange} onBlur={handleBlur} autoComplete="family-name" />
          </Field>
        </div>

        <div className="grid-2">
          <Field id="dob" label="Date of birth" required error={errors.dob}>
            <input id="dob" className={fieldClass("dob")} type="date" value={form.dob} onChange={handleChange} onBlur={handleBlur} />
          </Field>
          <Field id="gender" label="Gender" required error={errors.gender}>
            <select id="gender" className={fieldClass("gender")} value={form.gender} onChange={handleChange} onBlur={handleBlur}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
          </Field>
        </div>

        <div className="divider" />
        <div className="section-title">Contact details</div>

        <div className="grid-1">
          <Field id="email" label="Email address" required error={errors.email}>
            <input id="email" className={fieldClass("email")} type="text" placeholder="e.g. priya@example.com" value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
          </Field>
        </div>

        <div className="grid-2">
          <Field id="phone" label="Phone number" required error={errors.phone}>
            <input id="phone" className={fieldClass("phone")} type="tel" placeholder="e.g. +91 98765 43210" value={form.phone} onChange={handleChange} onBlur={handleBlur} autoComplete="tel" />
          </Field>
          <Field id="country" label="Country" required error={errors.country}>
            <select id="country" className={fieldClass("country")} value={form.country} onChange={handleChange} onBlur={handleBlur}>
              <option value="">Select country</option>
              {["India","United States","United Kingdom","Canada","Australia","Germany","France","Japan","Singapore","Other"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div className="divider" />
        <div className="section-title">Additional information</div>

        <div className="grid-2">
          <Field id="occupation" label="Occupation">
            <input id="occupation" className="input" type="text" placeholder="e.g. Software Engineer" value={form.occupation} onChange={handleChange} />
          </Field>
          <Field id="company" label="Company / Organisation">
            <input id="company" className="input" type="text" placeholder="e.g. Acme Pvt. Ltd." value={form.company} onChange={handleChange} />
          </Field>
        </div>

        <Field id="bio" label="Short bio">
          <textarea id="bio" className="input" placeholder="Tell us a little about yourself…" value={form.bio} onChange={handleChange} />
        </Field>

        <div className="actions">
          <button className="btn-reset" onClick={handleReset} type="button">Clear</button>
          <button className="btn-submit" onClick={handleSubmit} type="button" disabled={loading}>
            {loading ? <span className="spinner" /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, required, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required && <span className="req">*</span>}
      </label>
      {children}
      {error && (
        <div className="err-msg">
          <div className="err-dot" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
