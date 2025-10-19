import styles from "../pages/PreviousSubmissions.module.css";
import { useState, useEffect, useRef } from "react";
import Toast from "../shared/Toast/Toast";

export default function SubmissionItem({
  s,
  canEdit,
  onDelete,
  onUpdate,
  deletingId,
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: s.name || "",
    email: s.email || "",
    phone: s.phone || "",
    websiteType: s.websiteType || "personal",
    budget: s.budget || "under500",
    timeline: s.timeline || "1month",
    details: s.details || "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isSaving, setIsSaving] = useState(false);
  const firstInputRef = useRef(null);

  function save() {
    // Defensive: prevent saving if user isn't allowed to edit
    if (!canEdit) return;

    // Validation
    const errors = {};
    if (!form.name || !form.name.trim()) errors.name = "Name is required.";
    if (!form.email || !form.email.trim()) {
      errors.email = "Email is required.";
    } else {
      // Basic email validation
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(form.email)) errors.email = "Enter a valid email address.";
    }
    if (!form.websiteType) errors.websiteType = "Please choose a website type.";
    if (!form.budget) errors.budget = "Please choose a budget range.";
    if (!form.timeline) errors.timeline = "Please choose a timeline.";

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      // focus the first invalid field
      if (errors.name && firstInputRef.current) firstInputRef.current.focus();
      return;
    }

    // Persist changes via parent callback
    try {
      setIsSaving(true);
      // allow parent to persist
      onUpdate(form);
      setEditing(false);
      setToastMessage("Submission updated");
      setToastType("success");
      // clear validation errors on success
      setValidationErrors({});
    } catch (err) {
      console.error("Failed to update submission", err);
      setToastMessage("Failed to save changes");
      setToastType("error");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (editing && firstInputRef.current) firstInputRef.current.focus();
  }, [editing]);

  return (
    <li className={styles.submission}>
      <strong>{s.submittedBy}</strong> —{" "}
      {new Date(s.submittedAt).toLocaleString()}
      {editing ? (
        <div>
          <label>
            Name:{" "}
            <input
              ref={firstInputRef}
              aria-required="true"
              aria-invalid={validationErrors.name ? "true" : "false"}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {validationErrors.name && (
              <div role="alert" className={styles.error}>
                {validationErrors.name}
              </div>
            )}
          </label>
          <label>
            Email:{" "}
            <input
              type="email"
              aria-required="true"
              aria-invalid={validationErrors.email ? "true" : "false"}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {validationErrors.email && (
              <div role="alert" className={styles.error}>
                {validationErrors.email}
              </div>
            )}
          </label>
          <label>
            Phone:{" "}
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Website type:{" "}
            <select
              value={form.websiteType}
              aria-invalid={validationErrors.websiteType ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, websiteType: e.target.value })
              }
            >
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="ecommerce">E-commerce</option>
              <option value="blog">Blog</option>
              <option value="portfolio">Portfolio</option>
              <option value="other">Other</option>
            </select>
            {validationErrors.websiteType && (
              <div role="alert" className={styles.error}>
                {validationErrors.websiteType}
              </div>
            )}
          </label>
          <label>
            Budget:{" "}
            <select
              value={form.budget}
              aria-invalid={validationErrors.budget ? "true" : "false"}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            >
              <option value="under500">$0 - $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="over10000">Over $10,000</option>
            </select>
            {validationErrors.budget && (
              <div role="alert" className={styles.error}>
                {validationErrors.budget}
              </div>
            )}
          </label>
          <label>
            Timeline:{" "}
            <select
              value={form.timeline}
              aria-invalid={validationErrors.timeline ? "true" : "false"}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
            >
              <option value="1month">1 Month</option>
              <option value="2-3months">2-3 Months</option>
              <option value="4-6months">4-6 Months</option>
              <option value="6monthsplus">6 Months +</option>
            </select>
            {validationErrors.timeline && (
              <div role="alert" className={styles.error}>
                {validationErrors.timeline}
              </div>
            )}
          </label>
          {/* websiteType, budget, timeline selects are above with validation */}
          <label>
            Details:{" "}
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
          </label>
          <div>
            <button onClick={save} disabled={isSaving} aria-disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)} disabled={isSaving}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>Name: {s.name}</div>
          <div>Email: {s.email}</div>
          <div>Phone: {s.phone}</div>
          <div>Website type: {s.websiteType}</div>
          <div>Budget: {s.budget}</div>
          <div>Timeline: {s.timeline}</div>
          <div>Details: {s.details}</div>
          <div style={{ marginTop: 8 }}>
            {canEdit && <button onClick={() => setEditing(true)}>Edit</button>}
            {canEdit && (
              <button
                onClick={onDelete}
                disabled={deletingId === s.id}
                aria-disabled={deletingId === s.id}
              >
                {deletingId === s.id ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </>
      )}
      {/* Toast feedback for save operations */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />
    </li>
  );
}
