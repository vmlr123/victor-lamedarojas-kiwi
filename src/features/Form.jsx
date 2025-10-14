import styles from "./Form.module.css";
import { useState, useRef, useEffect, useCallback } from "react";
import Toast from "../shared/Toast/Toast";

export default function Form({ username }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteType, setWebsiteType] = useState("personal");
  const [budget, setBudget] = useState("under500");
  const [timeline, setTimeline] = useState("1month");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const statusRef = useRef(null);
  const nameRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const saveTimerRef = useRef(null);

  const DRAFT_KEY_PREFIX = "submission_draft";
  const draftKey = useCallback(() => {
    return username ? `${DRAFT_KEY_PREFIX}:${username}` : DRAFT_KEY_PREFIX;
  }, [username]);

  // Load draft on mount or when username changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey());
      if (raw) {
        const d = JSON.parse(raw);
        if (d.name) setName(d.name);
        if (d.email) setEmail(d.email);
        if (d.phone) setPhone(d.phone);
        if (d.websiteType) setWebsiteType(d.websiteType);
        if (d.budget) setBudget(d.budget);
        if (d.timeline) setTimeline(d.timeline);
        if (d.details) setDetails(d.details);
      }
    } catch (err) {
      console.error("Failed to load draft", err);
    }
  }, [draftKey]);

  // Autosave draft with debounce when any field changes
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    // indicate an autosave is pending
    setIsAutosaving(true);
    saveTimerRef.current = setTimeout(() => {
      try {
        const draft = {
          name,
          email,
          phone,
          websiteType,
          budget,
          timeline,
          details,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(draftKey(), JSON.stringify(draft));
      } catch (err) {
        console.error("Failed to save draft", err);
      } finally {
        setIsAutosaving(false);
      }
    }, 300);
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        setIsAutosaving(false);
      }
    };
  }, [name, email, phone, websiteType, budget, timeline, details, draftKey]);

  useEffect(() => {
    // If user is logged in and the form becomes enabled, focus the first field
    if (username && nameRef.current) {
      nameRef.current.focus();
    }
  }, [username]);
  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    // Here you would typically handle form submission, e.g., send data to a server
    // For this example, we'll just simulate a successful submission
    //POST METHOD HERE
    const submission = {
      id: Date.now(),
      name,
      email,
      phone,
      websiteType,
      budget,
      timeline,
      details,
      submittedAt: new Date().toISOString(),
      submittedBy: username || "anonymous",
    };

    try {
      const raw = localStorage.getItem("submissions") || "[]";
      const arr = JSON.parse(raw);
      arr.push(submission);
      localStorage.setItem("submissions", JSON.stringify(arr));
      setSubmitted(true);
      // Move focus to status message for screen readers
      if (statusRef.current) statusRef.current.focus();
      setToastMessage("Thank you — your inquiry was submitted.");
      setToastType("success");
      // Clear fields
      setName("");
      setEmail("");
      setPhone("");
      setDetails("");
      // Remove per-user draft after successful submit
      try {
        const draftKey = username
          ? `submission_draft:${username}`
          : "submission_draft";
        localStorage.removeItem(draftKey);
      } catch (err) {
        console.error("Failed to remove draft", err);
      }
      setIsSubmitting(false);
    } catch (err) {
      console.error("Failed to persist submission", err);
      setIsSubmitting(false);
    }
  }
  return (
    <>
      {username !== "" ? (
        <p>Welcome, {username}!</p>
      ) : (
        <p className={styles.loginMessage}>Please log in to submit the form.</p>
      )}
      <form onSubmit={handleSubmit}>
        <fieldset className={styles.personalInfo} disabled={!username}>
          <legend>Personal Information</legend>
          <label htmlFor="name">Name:</label>
          <input
            ref={nameRef}
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            aria-required="true"
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            aria-required="true"
          />
          <br />
          <label htmlFor="phone">Phone Number (US only):</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            aria-required="true"
          />
        </fieldset>
        <br />
        <fieldset className={styles.projectDetails} disabled={!username}>
          <legend>Project Details</legend>
          <label htmlFor="websiteType">Type of Website:</label>
          <select
            id="websiteType"
            name="websiteType"
            value={websiteType}
            onChange={(event) => setWebsiteType(event.target.value)}
            required
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="ecommerce">E-commerce</option>
            <option value="blog">Blog</option>
            <option value="portfolio">Portfolio</option>
            <option value="other">Other</option>
          </select>
          <br />
          <label htmlFor="budget">Budget Range:</label>
          <select
            name="budget"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            required
          >
            <option value="under500">$0 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000-10000">$5,000 - $10,000</option>
            <option value="over10000">Over $10,000</option>
          </select>
          <br />
          <label>Project Timeline:</label>
          <select
            name="timeline"
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            required
          >
            <option value="1month">1 Month</option>
            <option value="2-3months">2-3 Months</option>
            <option value="4-6months">4-6 Months</option>
            <option value="6monthsplus">6 Months +</option>
          </select>
          <br />
          <label htmlFor="details">Additional Details:</label>
          <br />
          <textarea
            id="details"
            name="details"
            rows="4"
            cols="50"
            placeholder="Describe your project, features needed, etc."
            value={details}
            onChange={(event) => setDetails(event.target.value)}
          ></textarea>
        </fieldset>
        <br />
        {isSubmitting && !submitted && (
          <p role="status" aria-live="polite">
            Submitting...
          </p>
        )}
        {isAutosaving && (
          <p role="status" aria-live="polite" className={styles.autosave}>
            Autosaving draft...
          </p>
        )}
        {submitted ? (
          <p tabIndex={-1} ref={statusRef} role="status" aria-live="polite">
            Thank you for your submission!
          </p>
        ) : (
          <button type="submit" disabled={!username} aria-disabled={!username}>
            Submit Inquiry
          </button>
        )}
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      </form>
    </>
  );
}
