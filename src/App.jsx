import "./App.css";
import Header from "./shared/Header/Header.jsx";
import Container from "./shared/Container/Container.jsx";
import { Routes, Route } from "react-router-dom";
import Survey from "./pages/Survey.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Error from "./pages/Error.jsx";
import PreviousSubmissions from "./pages/PreviousSubmissions.jsx";
import Register from "./features/Register.jsx";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  return (
    <Container>
      <Header />
      <Routes>
        <Route path="/" element={<Survey username={username} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            <Login
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
            />
          }
        />
        <Route
          path="/submissions"
          element={
            <PreviousSubmissions username={username} isLoggedIn={isLoggedIn} />
          }
        />
        <Route path="*" element={<Error />} />
        <Route
          path="/register"
          element={<Register username={username} isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Container>
  );
}

export default App;
