import AccountLogIn from "../features/AccountLogIn";
export default function Login({
  isLoggedIn,
  setIsLoggedIn,
  username,
  setUsername,
}) {
  return (
    <>
      {isLoggedIn ? (
        <>
          <h2>Account Login</h2>
          <p>You are logged in.</p>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setUsername("");
            }}
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <h2>Account Login</h2>
          <AccountLogIn
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            username={username}
            setUsername={setUsername}
          />
        </>
      )}
    </>
  );
}
