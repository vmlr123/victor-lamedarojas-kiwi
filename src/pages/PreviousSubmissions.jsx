import { useEffect, useState } from "react";
import styles from "./PreviousSubmissions.module.css";
import { isDefaultUser } from "../lib/usersStorage";
import SubmissionItem from "../features/SubmissionItem";

export default function PreviousSubmissions({ username, isLoggedIn }) {
  const [submissions, setSubmissions] = useState([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    try {
      setIsLoading(true);
      const raw = localStorage.getItem("submissions") || "[]";
      const all = JSON.parse(raw);
      if (!isLoggedIn || !username) {
        setSubmissions([]);
        setIsLoading(false);
        return;
      }
      const mine = isAdminView
        ? all
        : all.filter((s) => s.submittedBy === username);
      setSubmissions(mine);
      setIsLoading(false);
    } catch (err) {
      setLoadError("Failed to load submissions");
      setIsLoading(false);
      console.error("Failed to read submissions", err);
      setSubmissions([]);
    }
  }, [username, isLoggedIn, isAdminView]);

  // Determine whether the current user has any submissions (used to enable/disable Clear)
  const hasOwnSubmissions = (() => {
    try {
      const raw = localStorage.getItem("submissions") || "[]";
      const all = JSON.parse(raw);
      return all.some((s) => s.submittedBy === username);
    } catch {
      return false;
    }
  })();

  function clearSubmissions() {
    try {
      setIsClearing(true);
      const raw = localStorage.getItem("submissions") || "[]";
      const all = JSON.parse(raw);
      const remaining = all.filter((s) => s.submittedBy !== username);
      localStorage.setItem("submissions", JSON.stringify(remaining));
      setSubmissions([]);
      setIsClearing(false);
    } catch (err) {
      setIsClearing(false);
      console.error("Failed to clear submissions", err);
    }
  }

  function deleteSubmission(id) {
    try {
      setDeletingId(id);
      const raw = localStorage.getItem("submissions") || "[]";
      const all = JSON.parse(raw);
      const remaining = all.filter(
        (s) => s.id !== id || s.submittedBy !== username
      );
      localStorage.setItem("submissions", JSON.stringify(remaining));
      // update local view
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setDeletingId(null);
    } catch (err) {
      setDeletingId(null);
      console.error("Failed to delete submission", err);
    }
  }

  function updateSubmission(id, patch) {
    try {
      const raw = localStorage.getItem("submissions") || "[]";
      const all = JSON.parse(raw);
      const updated = all.map((s) => {
        if (s.id === id && s.submittedBy === username) {
          return { ...s, ...patch };
        }
        return s;
      });
      localStorage.setItem("submissions", JSON.stringify(updated));
      // update local view
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
      );
    } catch (err) {
      console.error("Failed to update submission", err);
    }
  }

  return (
    <>
      <h2>Previous Submissions</h2>
      {!isLoggedIn ? (
        <p>Please log in to view your previous submissions.</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={clearSubmissions}
              disabled={isClearing || !hasOwnSubmissions}
            >
              {isClearing ? "Clearing..." : "Clear My Submissions"}
            </button>
            {isLoggedIn && isDefaultUser(username) && (
              <button onClick={() => setIsAdminView((v) => !v)}>
                {isAdminView ? "View Mine" : "View All (Admin)"}
              </button>
            )}
          </div>

          {isLoading ? (
            <p role="status" aria-live="polite">
              Loading submissions...
            </p>
          ) : loadError ? (
            <p role="alert">{loadError}</p>
          ) : submissions.length === 0 ? (
            <p>No previous submissions found for {username}.</p>
          ) : (
            <ul className={styles.submissions}>
              {submissions.map((s) => (
                <SubmissionItem
                  key={s.id}
                  s={s}
                  deletingId={deletingId}
                  canEdit={s.submittedBy === username}
                  onDelete={() => deleteSubmission(s.id)}
                  onUpdate={(patch) => updateSubmission(s.id, patch)}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
