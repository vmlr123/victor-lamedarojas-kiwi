import { useState, useRef, useEffect } from "react";
import { findUser } from "../lib/usersStorage";
import styles from "./AccountLogIn.module.css";
import Toast from "../shared/Toast/Toast";
import { NavLink } from "react-router-dom";

export default function AccountLogin({
  isLoggedIn,
  setIsLoggedIn,
  username,
  setUsername,
}) {
  const [workingUsername, setWorkingUsername] = useState("");
  const [workingPassword, setWorkingPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const usernameRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    // autofocus username on mount
    if (usernameRef.current) usernameRef.current.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingIn(true);
    // Basic validation first
    if (!workingUsername || !workingPassword) {
      const msg = "Please enter both username and password.";
      setMessage(msg);
      setMessageType("error");
      setToastMessage(msg);
      setToastType("error");
      if (messageRef.current) messageRef.current.focus();
      setIsLoggingIn(false);
      return;
    }

    // Find matching user
    const found = findUser(workingUsername, workingPassword);

    if (found) {
      setIsLoggedIn(true);
      setUsername(workingUsername);
      const msg = `Login successful! Welcome ${workingUsername}!`;
      setMessage(msg);
      setMessageType("success");
      setToastMessage(msg);
      setToastType("success");
      // move focus to message for screen reader users
      if (messageRef.current) messageRef.current.focus();
      setIsLoggingIn(false);
    } else {
      const msg = "Invalid username or password.";
      setMessage(msg);
      setMessageType("error");
      setToastMessage(msg);
      setToastType("error");
      setWorkingPassword("");
      setWorkingUsername("");
      if (messageRef.current) messageRef.current.focus();
      setIsLoggingIn(false);
    }
  }
  return (
    <>
      <>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="username" className={styles.username}>
              Username:
            </label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              onChange={(event) => setWorkingUsername(event.target.value)}
              value={workingUsername}
              required
              aria-required="true"
            />
            <label htmlFor="password" className={styles.password}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              onChange={(event) => setWorkingPassword(event.target.value)}
              value={workingPassword}
              required
              aria-required="true"
            />
            <br />
            <button type="submit" aria-pressed="false" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
            {message && (
              <p
                tabIndex={-1}
                ref={messageRef}
                role="status"
                aria-live={messageType === "error" ? "assertive" : "polite"}
                className={
                  messageType === "success" ? styles.success : styles.error
                }
              >
                {message}
              </p>
            )}
            <Toast
              message={toastMessage}
              type={toastType}
              onClose={() => setToastMessage("")}
            />
          </fieldset>
        </form>
        {!username && !isLoggedIn && (
          <NavLink
            to={"/register"}
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            Register
          </NavLink>
        )}
      </>
    </>
  );
}
