import { useState, useRef, useEffect } from "react";
import { loadUsers, addUser } from "../lib/usersStorage";
import Toast from "../shared/Toast/Toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [isRegistering, setIsRegistering] = useState(false);
  const messageRef = useRef(null);
  const redirectRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, []);

  function loadStoredUsers() {
    return loadUsers();
  }

  function validate() {
    if (!username || !password || !repeatPassword) {
      setMessage("All fields are required.");
      setMessageType("error");
      return false;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setMessageType("error");
      return false;
    }
    if (password !== repeatPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return false;
    }
    const existing = loadStoredUsers();
    if (existing.find((u) => u.username === username)) {
      setMessage("Username already taken.");
      setMessageType("error");
      return false;
    }
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsRegistering(true);

    if (!validate()) {
      if (messageRef.current) messageRef.current.focus();
      setToastMessage(message || "Please fix errors and try again.");
      setToastType("error");
      return;
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
    };
    addUser(newUser);

    const success = "Registration successful. You can now log in.";
    setMessage(success);
    setMessageType("success");
    setToastMessage(success);
    setToastType("success");
    // Clear form
    setUsername("");
    setPassword("");
    setRepeatPassword("");
    if (messageRef.current) messageRef.current.focus();
    // Redirect to login after a short delay so user can see the toast
    redirectRef.current = setTimeout(() => {
      setIsRegistering(false);
      navigate("/login");
    }, 1200);
  }

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Create an Account</legend>
          <label htmlFor="new-username">Username:</label>
          <input
            id="new-username"
            type="text"
            name="new-username"
            required
            aria-required="true"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <label htmlFor="new-password">Password:</label>
          <input
            id="new-password"
            type="password"
            name="new-password"
            required
            aria-required="true"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <label htmlFor="repeat-password">Repeat Password:</label>
          <input
            id="repeat-password"
            type="password"
            name="repeat-password"
            required
            aria-required="true"
            placeholder="Enter password again"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            autoComplete="new-password"
          />
          <br />
          <button type="submit" aria-pressed="false" disabled={isRegistering}>
            {isRegistering ? "Registering..." : "Register"}
          </button>
          {message && (
            <p
              tabIndex={-1}
              ref={messageRef}
              role="status"
              aria-live={messageType === "error" ? "assertive" : "polite"}
              style={{ color: messageType === "error" ? "#dc3545" : "#28a745" }}
            >
              {message}
            </p>
          )}
          <p style={{ fontSize: "0.9rem" }}>
            Make sure the password is 8 characters or longer.
          </p>
        </fieldset>
      </form>
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />
    </>
  );
}
